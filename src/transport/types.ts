import { Message } from 'message';

export interface IReceiver {
  readonly get: () => Promise<any>;
}

export interface ISender {
  readonly send: (message: Message) => Promise<void>;
}

export interface ITransport extends IReceiver, ISender {}
