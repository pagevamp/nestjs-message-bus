import { Module } from '@nestjs/common';
import { Dispatcher } from '../../dispatcher';
import { SyncTransport } from './sync-transport';

@Module({
  providers: [SyncTransport, Dispatcher],
  exports: [SyncTransport],
})
export class SyncModule {}
