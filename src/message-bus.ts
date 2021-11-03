import { Injectable } from '@nestjs/common';
import { IMessage } from './interfaces/message.interface';
import { ILabel } from './label';
import { MessagePublisher } from './message-publisher';

@Injectable()
export class MessageBus {
  constructor(private readonly publisher: MessagePublisher) {}

  async dispatch(
    message: IMessage,
    labels: readonly ILabel[] = [],
  ): Promise<void> {
    return this.publisher.publish(message, labels);
  }
}
