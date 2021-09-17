import { Module } from '@nestjs/common';
import { CloudTaskRequest } from './cloud-task.request';
import { CloudTaskTransport } from './cloud-task.transport';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskReceiver } from './cloud-task.receiver';

@Module({
  providers: [CloudTaskRequest, CloudTaskSender, CloudTaskReceiver, CloudTaskTransport],
  exports: [CloudTaskTransport],
})
export class CloudTaskModule {}
