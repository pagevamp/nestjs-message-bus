import { Test } from '@nestjs/testing';
import { Controller, HttpCode, Post } from '@nestjs/common';
import request from 'supertest';
import { MessageHandlerStore } from '../src/message-handler-store';
import { IMessage, IMessageHandler } from '../src/interfaces';
import { MessageHandler } from '../src/decorator';
import { MessageBus } from '../src/message-bus';
import { Message } from '../src/message';
import { CloudTaskSender } from '../src/transport/cloud-task';
import { MessageBusModule } from '../src/message-bus.module';
import { Dispatcher } from '../src/dispatcher';
import { Worker } from '../src/worker';

describe('Message Bus - Cloud Task', () => {
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

    const app = await Test.createTestingModule({
      imports: [
        MessageBusModule.register({
          transport: 'cloud-task',
        }),
      ],
      providers: [SendEmailMessageHandler],
    }).compile();

    const messageBus = app.get<MessageBus>(MessageBus);
    const transport = app.get(CloudTaskSender);

    transport.send = jest.fn();

    const message = new SendEmailMessage('random+abcd@test.com', 'hello there');
    await messageBus.dispatch(message);

    expect(transport.send).toHaveBeenCalledTimes(1);
    expect(transport.send).toHaveBeenCalledWith(
      new Message('SendEmailMessage', 'SendEmailMessageHandler', message, 'v1'),
    );

    MessageHandlerStore.clear();
    await app.close();
  });

  it.only('it should execute appropriate handler for received cloud task request body', async () => {
    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    @MessageHandler(SendEmailMessage)
    class SendEmailMessageHandler implements IMessageHandler<SendEmailMessage> {
      execute(message: SendEmailMessage): Promise<void> {
        console.log(message);
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

    const app = await Test.createTestingModule({
      imports: [
        MessageBusModule.register({
          transport: 'cloud-task',
        }),
      ],
      providers: [SendEmailMessageHandler],
      controllers: [WorkerController],
    }).compile();

    const instance = app.createNestApplication();
    instance.init();

    const dispatcher = app.get(Dispatcher);
    const dispatcherMock = jest.spyOn(dispatcher, 'dispatchNow');

    await request(instance.getHttpServer())
      .post('/cloud-task-worker')
      .send({
        name: 'SendEmailMessage',
        handler: 'SendEmailMessageHandler',
        payload: { emailAddress: 'random@gmail.com', text: 'Hi there' },
        version: 'v1',
      })
      .expect(200);

    // expect(dispatcherMock).toHaveBeenCalledTimes(1);
    // expect(dispatcherMock).toHaveBeenCalledWith(
    //   new Message(
    //     'SendEmailMessage',
    //     'SendEmailMessageHandler',
    //     { emailAddress: 'random@gmail.com', text: 'Hi there' },
    //     'v1',
    //   ),
    // );

    dispatcherMock.mockRestore();

    MessageHandlerStore.clear();
    await instance.close();
  });
});
