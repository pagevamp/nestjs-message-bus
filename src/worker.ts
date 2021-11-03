import { Injectable } from '@nestjs/common';
import { Dispatcher } from './dispatcher';
import { IReceiver } from './transport';

@Injectable()
export class Worker {
  constructor(private readonly dispatcher: Dispatcher) {}

  async run(...receivers: readonly IReceiver[]) {
    for (const receiver of receivers) {
      for await (const envelope of receiver.get()) {
        await this.dispatcher.dispatchNow(envelope.message);
      }
    }
  }
}
