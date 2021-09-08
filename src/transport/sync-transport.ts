import { Injectable } from '@nestjs/common';
import { ITransport } from '../types';
import { Message } from '../message';
import { MessageExecutor } from '../message-executor';

@Injectable()
export class SyncTransport implements ITransport {
  constructor(private readonly messageExecutor: MessageExecutor) {}

  publish(message: Message): Promise<void> {
    return this.messageExecutor.execute(message);
  }
}
