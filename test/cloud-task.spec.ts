import { Controller, HttpCode, Post } from '@nestjs/common';
import request from 'supertest';
import { MessageHandlerStore } from '../src/message-handler-store';
import { IMessage, IMessageHandler } from '../src/interfaces';
import { MessageHandler } from '../src/decorator';
import { MessageBus } from '../src/message-bus';
import { Message } from '../src/message';
import { CloudTaskSender } from '../src/transport/cloud-task';
import { MessageBusModule } from '../src/message-bus.module';
import { Worker } from '../src/worker';
import { appFactory } from './factory/app.factory';

describe('Message Bus - Cloud Task', () => {
  afterEach(() => {
    MessageHandlerStore.clear();
  });

  it('it should dispatch message using valid cloud-task transport', async () => {
    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    @MessageHandler(SendEmailMessage)
    class SendEmailMessageHandler implements IMessageHandler<SendEmailMessage> {
      execute(message: SendEmailMessage): Promise<void> {
        return Promise.resolve();
      }
    }

    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'cloud-task',
          cloudTask: {
            defaultQueue: 'default',
            project: 'default',
            region: 'us-central1',
            serviceAccountEmail: 'default@project-id.iam.gserviceaccount.com',
            workerHostUrl: '/cloud-task-worker',
          },
        }),
      ],
      providers: [SendEmailMessageHandler],
    });

    const messageBus = app.get<MessageBus>(MessageBus);
    const transport = app.get(CloudTaskSender);

    transport.send = jest.fn();

    const message = new SendEmailMessage('random+abcd@test.com', 'hello there');
    await messageBus.dispatch(message);

    expect(transport.send).toHaveBeenCalledTimes(1);
    expect(transport.send).toHaveBeenCalledWith(
      new Message('SendEmailMessage', 'SendEmailMessageHandler', message, 'v1'),
    );

    await app.close();
  });

  it('it should execute appropriate handler for received cloud task request body', async () => {
    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    @MessageHandler(SendEmailMessage)
    class SendEmailMessageHandler implements IMessageHandler<SendEmailMessage> {
      execute(message: SendEmailMessage): Promise<void> {
        return Promise.resolve();
      }
    }

    @Controller()
    class WorkerController {
      constructor(private readonly worker: Worker) {}

      @Post('/cloud-task-worker')
      @HttpCode(200)
      async runWorker() {
        await this.worker.run('cloud-task');
      }
    }

    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'cloud-task',
          cloudTask: {
            defaultQueue: 'default',
            project: 'default',
            region: 'us-central1',
            serviceAccountEmail: 'default@project-id.iam.gserviceaccount.com',
            workerHostUrl: '/cloud-task-worker',
          },
        }),
      ],
      providers: [SendEmailMessageHandler],
      controllers: [WorkerController],
    });

    const sendEmailMessageHandler = app.get(SendEmailMessageHandler);
    const handlerMock = jest.spyOn(sendEmailMessageHandler, 'execute');

    await request(app.getHttpServer())
      .post('/cloud-task-worker')
      .send({
        name: 'SendEmailMessage',
        handler: 'SendEmailMessageHandler',
        payload: { emailAddress: 'random@gmail.com', text: 'Hi there' },
        version: 'v1',
      })
      .expect(200);

    expect(handlerMock).toHaveBeenCalledTimes(1);
    expect(handlerMock).toHaveBeenCalledWith(new SendEmailMessage('random@gmail.com', 'Hi there'));

    handlerMock.mockRestore();
    await app.close();
  });
});
