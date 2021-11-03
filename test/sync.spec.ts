import { MessageHandlerStore } from '../src/message-handler-store';
import { MessagePublisher } from '../src/message-publisher';
import { IMessage, IMessageHandler } from '../src/interfaces';
import { MessageHandler } from '../src/decorator';
import { MessageBus } from '../src/message-bus';
import { Message } from '../src/message';
import { Envelope } from '../src/envelope';
import { SyncSender } from '../src/transport/sync/sync.sender';
import { MessageBusModule } from '../src/message-bus.module';
import { appFactory } from './factory/app.factory';

describe('Message Bus - Sync', () => {
  afterEach(() => {
    MessageHandlerStore.clear();
  });

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

    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
      providers: [SendEmailHandler],
    });

    const messageBus = app.get<MessageBus>(MessageBus);
    const messagePublisherMock = jest.spyOn(app.get(MessagePublisher), 'publish');

    const message = new SendEmailMessage('random@test.com', 'hello there');
    await messageBus.dispatch(message);

    expect(messagePublisherMock).toHaveBeenCalledTimes(1);
    expect(messagePublisherMock).toHaveBeenCalledWith(message, []);

    messagePublisherMock.mockRestore();
    await app.close();
  });

  it('it should exit with exception if handler for message is absent', async () => {
    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
    });

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
    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
    });

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

    const app = await appFactory({
      imports: [
        MessageBusModule.register({
          transport: 'sync',
        }),
      ],
      providers: [SendEmailMessageHandler],
    });

    const messageBus = app.get<MessageBus>(MessageBus);
    const sender = app.get(SyncSender);

    sender.send = jest.fn();

    const message = new SendEmailMessage('random+abcd@test.com', 'hello there');
    await messageBus.dispatch(message);

    expect(sender.send).toHaveBeenCalledTimes(1);
    expect(sender.send).toHaveBeenCalledWith(
      new Envelope(new Message('SendEmailMessage', 'SendEmailMessageHandler', message, 'v1')),
    );

    await app.close();
  });
});
