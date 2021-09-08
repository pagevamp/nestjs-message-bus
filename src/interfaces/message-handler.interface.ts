import { IMessage } from './message.interface';

export interface IMessageHandler<TMessage extends IMessage = any> {
  readonly execute: (message: IMessage) => Promise<void>;
}
