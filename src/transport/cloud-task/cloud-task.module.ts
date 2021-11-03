import { Global, Module } from '@nestjs/common';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskReceiver } from './cloud-task.receiver';

@Global()
@Module({
  providers: [CloudTaskSender, CloudTaskReceiver],
  exports: [CloudTaskSender, CloudTaskReceiver],
})
export class CloudTaskModule {}
