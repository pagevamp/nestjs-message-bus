import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CloudTasksClient } from '@google-cloud/tasks';
import { CloudTaskConfig, ModuleConfig } from '../../types';
import { Message } from '../../message';
import { MODULE_CONFIG } from '../../constant';
import { MessageHandlerStore } from '../../message-handler-store';
import { ITransport } from '../types';
import { CloudTaskRequest } from './cloud-task.request';

@Injectable()
export class CloudTaskTransport implements ITransport {
  private readonly client = new CloudTasksClient();
  private readonly moduleConfig: ModuleConfig;

  constructor(private readonly moduleRef: ModuleRef, private readonly request: CloudTaskRequest) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: false });
  }

  async send(message: Message) {
    const { project, serviceAccountEmail, workerHostUrl, region, defaultQueue } = this.moduleConfig
      .cloudTask as CloudTaskConfig;

    const handlerConfig = MessageHandlerStore.ofMessageName(message.name);
    const queue = handlerConfig?.queue || defaultQueue;

    await this.client.createTask({
      parent: this.client.queuePath(project, region, queue),
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url: workerHostUrl,
          body: Buffer.from(JSON.stringify(message)),
          headers: {
            'Content-Type': 'application/json',
          },
          oidcToken: {
            serviceAccountEmail: serviceAccountEmail,
          },
        },
      },
    });
  }

  async *get() {
    const body = this.request.getBody();
    const message = new Message(body.name, body.handler, body.payload, body.version);
    yield message;
  }
}
