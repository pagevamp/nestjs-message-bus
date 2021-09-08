import { Injectable } from '@nestjs/common';
import { IReceiver } from '../types';

@Injectable()
export class CloudTaskReceiver implements IReceiver {
  async get() {
    throw new Error('Not implemented yet..');
  }
}
