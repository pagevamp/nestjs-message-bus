import { IMessage } from '../interfaces/message.interface';

export class DummyMessage implements IMessage {
  constructor(public readonly message: string) {}
}
