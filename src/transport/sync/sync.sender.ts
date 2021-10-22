import { Injectable } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { ISender } from '../types';
import { Message } from '../../message';

@Injectable()
export class SyncSender implements ISender {
  constructor(private readonly dispatcher: Dispatcher) {}

  async send(message: Message) {
    await this.dispatcher.dispatchNow(message);
  }
}
