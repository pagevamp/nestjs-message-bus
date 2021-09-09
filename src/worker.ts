import { Injectable } from '@nestjs/common';
import { Dispatcher } from './dispatcher';
import { TransportResolver } from './transport.resolver';

@Injectable()
export class Worker {
  constructor(
    private readonly transportResolver: TransportResolver,
    private readonly dispatcher: Dispatcher,
  ) {}

  async run(transport: string) {
    const resolvedReceiver = this.transportResolver.receiver(transport);

    for await (const message of resolvedReceiver.get()) {
      await this.dispatcher.dispatchNow(message);
    }
  }
}
