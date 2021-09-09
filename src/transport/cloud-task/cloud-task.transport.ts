import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ITransport } from '../types';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskReceiver } from './cloud-task.receiver';

@Injectable()
export class CloudTaskTransport implements ITransport {
  constructor(private readonly moduleRef: ModuleRef) {}

  sender() {
    return this.moduleRef.get(CloudTaskSender, { strict: false });
  }

  receiver() {
    return this.moduleRef.get(CloudTaskReceiver, { strict: false });
  }
}
