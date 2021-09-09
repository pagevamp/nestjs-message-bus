import { Test } from '@nestjs/testing';
import { MessageHandlerStore } from '../../src/message-handler-store';
import { MessagePublisher } from '../../src/message-publisher';
import { IMessage, IMessageHandler } from '../../src/interfaces';
import { MessageHandler } from '../../src/decorator';
import { MessageBus } from '../../src/message-bus';
import { Message } from '../../src/message';
import { CloudTaskSender } from '../../src/transport/cloud-task';
import { SyncSender } from '../../src/transport/sync';
import { MessageBusModule } from '../../src/message-bus.module';

describe('Message Bus', () => {
  it('it should dispatch message to a message handler calling appropriate publisher', async () => {
    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    @MessageHandler(SendEmailMessage)
    class SendEmailHandler implements IMessageHandler<SendEmailMessage> {
      execute(message: SendEmailMessage): Promise<void> {
        return Promise.resolve();
      }
    }

    const app = await Test.createTestingModule({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
      providers: [SendEmailHandler],
    }).compile();

    const messageBus = app.get<MessageBus>(MessageBus);
    const messagePublisherMock = jest.spyOn(app.get(MessagePublisher), 'publish');

    const message = new SendEmailMessage('random@test.com', 'hello there');
    await messageBus.dispatch(message);

    expect(messagePublisherMock).toHaveBeenCalledTimes(1);
    expect(messagePublisherMock).toHaveBeenCalledWith(message);

    messagePublisherMock.mockRestore();
    MessageHandlerStore.clear();
    await app.close();
  });

  it('it should exit with exception if handler for message is absent', async () => {
    const app = await Test.createTestingModule({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
    }).compile();

    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    const messageBus = app.get<MessageBus>(MessageBus);

    const message = new SendEmailMessage('ramdom@test.com', 'hello there');

    await expect(messageBus.dispatch(message)).rejects.toThrowError(
      'Unable to find handler for message: SendEmailMessage',
    );

    await app.close();
  });

  it('it should exit with exception if handler for message is not registered as a provider', async () => {
    const app = await Test.createTestingModule({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
    }).compile();

    class SendEmailMessage implements IMessage {
      constructor(public readonly emailAddress: string, public readonly text: string) {}
    }

    @MessageHandler(SendEmailMessage)
    class SendEmailMessageHandler implements IMessageHandler<SendEmailMessage> {
      execute(message: SendEmailMessage): Promise<void> {
        return Promise.resolve();
      }
    }

    const messageBus = app.get<MessageBus>(MessageBus);

    const message = new SendEmailMessage('ramdom@test.com', 'hello there');

    await expect(messageBus.dispatch(message)).rejects.toThrowError();

    MessageHandlerStore.clear();
    await app.close();
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

  it('it should dispatch task using valid sync transport', async () => {
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
          transport: 'sync',
        }),
      ],
      providers: [SendEmailMessageHandler],
    }).compile();

    const messageBus = app.get<MessageBus>(MessageBus);
    const transport = app.get(SyncSender);

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
});
