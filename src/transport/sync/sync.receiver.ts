import { Injectable } from '@nestjs/common';
import { IReceiver } from '../types';

@Injectable()
export class SyncReceiver implements IReceiver {
  async *get() {
    throw new Error('Sync transport cannot listen to messages');
  }
}
