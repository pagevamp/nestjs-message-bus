import { Injectable } from '@nestjs/common';
import { CloudTaskRequest } from './cloud-task.request';
import { IReceiver } from '../types';
import { Message } from '../../message';

@Injectable()
export class CloudTaskReceiver implements IReceiver {
  constructor(private readonly request: CloudTaskRequest) {}

  async *get() {
    const body = this.request.getBody();
    const message = new Message(body.name, body.handler, body.payload, body.version);
    yield message;
  }
}
