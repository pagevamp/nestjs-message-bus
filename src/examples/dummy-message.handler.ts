import { IMessageHandler } from '../interfaces/message-handler.interface';
import { MessageHandler } from '../decorator/message-handler.decorator';
import { DummyMessage } from './dummy-message';

@MessageHandler(DummyMessage)
export class DummyMessageHandler implements IMessageHandler<DummyMessage> {
  execute(message: DummyMessage): Promise<void> {
    return Promise.resolve();
  }
}
