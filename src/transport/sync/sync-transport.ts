import { Injectable } from '@nestjs/common';
import { ITransport } from '../../types';
import { Message } from '../../message';
import { Dispatcher } from '../dispatcher';

@Injectable()
export class SyncTransport implements ITransport {
  constructor(private readonly dispatcher: Dispatcher) {}

  async send(message: Message) {
    return this.dispatcher.dispatchNow(message);
  }

  async get() {
    throw new Error('Sync transport does not support receiving messages');
  }
}
