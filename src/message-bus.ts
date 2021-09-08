import { Injectable } from '@nestjs/common';
import { IMessage } from './interfaces/message.interface';
import { MessagePublisher } from './message-publisher';

@Injectable()
export class MessageBus {
  constructor(private readonly publisher: MessagePublisher) {}

  async dispatch(message: IMessage): Promise<void> {
    return this.publisher.publish(message);
  }
}
