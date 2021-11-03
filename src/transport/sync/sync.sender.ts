import { Injectable } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { ISender } from '../types';
import { Envelope } from '../../envelope';

@Injectable()
export class SyncSender implements ISender {
  constructor(private readonly dispatcher: Dispatcher) {}

  async send(envelope: Envelope) {
    await this.dispatcher.dispatchNow(envelope.message);
  }
}
