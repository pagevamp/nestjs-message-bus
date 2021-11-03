import { Module } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { SyncSender } from './sync.sender';
import { SyncReceiver } from './sync.receiver';

@Module({
  providers: [SyncSender, SyncReceiver, Dispatcher],
  exports: [SyncSender, SyncReceiver],
})
export class SyncModule {}
