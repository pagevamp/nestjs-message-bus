import { Message } from 'message';

export interface ITransport {
  readonly send: (message: Message) => Promise<void>;
  readonly get: () => AsyncGenerator<Message>;
}
