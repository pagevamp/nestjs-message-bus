import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CloudTaskRequest } from './cloud-task.request';
import { CloudTaskTransport } from './cloud-task.transport';
import { CloudTaskSender } from './cloud-task.sender';
import { CloudTaskReceiver } from './cloud-task.receiver';
import { RequestMiddleware } from './request.middleware';
import { ModuleConfig } from '../../types';
import { MODULE_CONFIG } from '../../constant';

@Module({
  providers: [CloudTaskRequest, CloudTaskSender, CloudTaskReceiver, CloudTaskTransport],
  exports: [CloudTaskTransport],
})
export class CloudTaskModule implements NestModule {
  private readonly moduleConfig: ModuleConfig;

  constructor(private readonly moduleRef: ModuleRef) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: false });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes(this.moduleConfig.cloudTask?.workerHostUrl as string);
  }
}
