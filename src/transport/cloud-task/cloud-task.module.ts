import { Module } from '@nestjs/common';
import { CloudTaskRequest } from './cloud-task.request';
import { CloudTaskTransport } from './cloud-task.transport';

@Module({
  providers: [CloudTaskRequest, CloudTaskTransport],
  exports: [CloudTaskTransport],
})
export class CloudTaskModule {}
