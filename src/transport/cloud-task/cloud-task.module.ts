import { Module } from '@nestjs/common';
import { CloudTaskReceiver } from './cloud-task.receiver';
import { CloudTaskRequest } from './cloud-task.request';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskTransport } from './cloud-task.transport';

@Module({
  providers: [CloudTaskReceiver, CloudTaskSender, CloudTaskRequest, CloudTaskTransport],
  exports: [CloudTaskTransport],
})
export class CloudTaskModule {}
