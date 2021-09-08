import { Injectable } from '@nestjs/common';
import { ITransport } from '../../types';
import { Message } from '../../message';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskReceiver } from './cloud-task.receiver';

@Injectable()
export class CloudTaskTransport implements ITransport {
  constructor(
    private readonly receiver: CloudTaskReceiver,
    private readonly sender: CloudTaskSender,
  ) {}

  async send(message: Message) {
    return this.sender.send(message);
  }

  async get() {
    return this.receiver.get();
  }
}
