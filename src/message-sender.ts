import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ISender } from './transport';
import { CloudTaskSender } from './transport/cloud-task/cloud-task.sender';
import { SyncSender } from './transport/sync/sync.sender';

@Injectable()
export class MessageSender {
  constructor(private readonly moduleRef: ModuleRef) {}

  resolve(transport: string): ISender {
    switch (transport) {
      case 'cloud-task':
        return this.moduleRef.get(CloudTaskSender, { strict: false });

      case 'sync':
        return this.moduleRef.get(SyncSender, { strict: false });

      default:
        throw new Error('Un-supported message bus transport');
    }
  }
}
