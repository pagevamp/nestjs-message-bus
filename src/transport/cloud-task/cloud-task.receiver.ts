import { Injectable } from '@nestjs/common';
import { Message } from '../../message';
import { IReceiver } from '../types';
import { CloudTaskRequest } from './cloud-task.request';

@Injectable()
export class CloudTaskReceiver implements IReceiver {
  async *get() {
    const body = CloudTaskRequest.getBody();
    const message = new Message(body.name, body.handler, body.payload, body.version);
    yield message;
  }
}
