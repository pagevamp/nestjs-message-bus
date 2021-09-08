import { Injectable } from '@nestjs/common';
import { IMessage } from './interfaces/message.interface';
import { MessageBusPublisher } from './message-bus-publisher';
import { Message } from './message';
import { MessageExecutor } from './message-executor';

@Injectable()
export class MessageBus {
  constructor(
    private readonly publisher: MessageBusPublisher,
    private readonly messageExecutor: MessageExecutor,
  ) {}

  async dispatch(message: IMessage): Promise<void> {
    return this.publisher.publish(message);
  }

  async execute(message: Message): Promise<void> {
    return this.messageExecutor.execute(message);
  }
}
