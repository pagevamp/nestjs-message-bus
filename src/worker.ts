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
    const resolvedTransport = this.transportResolver.resolve(transport);

    for await (const message of resolvedTransport.get()) {
      await this.dispatcher.dispatchNow(message);
    }
  }
}
