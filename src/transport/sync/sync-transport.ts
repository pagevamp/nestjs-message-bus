import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ITransport } from '../types';
import { SyncSender } from './sync.sender';
import { SyncReceiver } from './sync.receiver';

@Injectable()
export class SyncTransport implements ITransport {
  constructor(private readonly moduleRef: ModuleRef) {}

  sender() {
    return this.moduleRef.get(SyncSender, { strict: false });
  }

  receiver() {
    return this.moduleRef.get(SyncReceiver, { strict: false });
  }
}
