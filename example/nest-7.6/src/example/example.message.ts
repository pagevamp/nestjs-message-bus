import { IMessage } from 'nestjs-message-bus';

export class ExampleMessage implements IMessage {
  constructor(public readonly body: string) {}
}
