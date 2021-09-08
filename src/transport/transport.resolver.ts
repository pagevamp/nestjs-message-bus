import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ITransport, Transport } from '../types';
import { CloudTaskTransport, SyncTransport } from '../transport';

@Injectable()
export class TransportResolver {
  constructor(private readonly moduleRef: ModuleRef) {}

  resolve(transport: Transport): ITransport {
    switch (transport) {
      case Transport.CLOUD_TASK:
        return this.moduleRef.get(CloudTaskTransport, { strict: true });

      case Transport.SYNC:
        return this.moduleRef.get(SyncTransport, { strict: true });

      default:
        throw new Error('Un-supported message bus transport');
    }
  }
}
