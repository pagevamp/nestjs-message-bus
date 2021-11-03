import { Message } from '../message';

export interface ISender {
  readonly send: (message: Message) => Promise<void>;
}

export interface IReceiver {
  readonly get: () => AsyncGenerator<Message>;
}
