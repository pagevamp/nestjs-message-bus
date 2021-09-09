import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ITransport } from 'transport';
import { CloudTaskTransport } from './transport/cloud-task';
import { SyncTransport } from './transport/sync';

@Injectable()
export class TransportResolver {
  constructor(private readonly moduleRef: ModuleRef) {}

  private resolve(transport: string): ITransport {
    switch (transport) {
      case 'cloud-task':
        return this.moduleRef.get(CloudTaskTransport, { strict: false });

      case 'sync':
        return this.moduleRef.get(SyncTransport, { strict: false });

      default:
        throw new Error('Un-supported message bus transport');
    }
  }

  sender(transport: string) {
    return this.resolve(transport).sender();
  }

  receiver(transport: string) {
    return this.resolve(transport).receiver();
  }
}
