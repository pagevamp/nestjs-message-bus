import { Module } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { SyncSender } from './sync.sender';

@Module({
  providers: [SyncSender, Dispatcher],
  exports: [SyncSender],
})
export class SyncModule {}
