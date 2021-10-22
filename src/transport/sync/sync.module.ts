import { Module } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { SyncTransport } from './sync-transport';
import { SyncSender } from './sync.sender';
import { SyncReceiver } from './sync.receiver';

@Module({
  providers: [SyncTransport, SyncSender, SyncReceiver, Dispatcher],
  exports: [SyncTransport],
})
export class SyncModule {}
