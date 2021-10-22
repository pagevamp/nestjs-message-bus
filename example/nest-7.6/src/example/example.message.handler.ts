import { IMessageHandler, MessageHandler } from 'nestjs-message-bus';
import { ExampleMessage } from 'src/example/example.message';

@MessageHandler(ExampleMessage)
export class ExampleMessageHandler implements IMessageHandler<ExampleMessage> {
  async execute(message: ExampleMessage): Promise<void> {
    console.log(message);
  }
}
