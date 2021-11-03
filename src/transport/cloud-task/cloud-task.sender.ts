import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CloudTasksClient } from '@google-cloud/tasks';
import { serialize } from 'class-transformer';
import { CloudTaskConfig, ModuleConfig } from '../../types';
import { MODULE_CONFIG } from '../../constant';
import { MessageHandlerStore } from '../../message-handler-store';
import { ISender } from '../types';
import { Envelope } from '../../envelope';
import { DelayLabel } from '../../label/delay-label';

@Injectable()
export class CloudTaskSender implements ISender {
  private readonly client = new CloudTasksClient();
  private readonly moduleConfig: ModuleConfig;

  constructor(private readonly moduleRef: ModuleRef) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: false });
  }

  async send(envelope: Envelope) {
    const { project, serviceAccountEmail, workerHostUrl, region, defaultQueue } = this.moduleConfig
      .cloudTask as CloudTaskConfig;

    const message = envelope.message;
    const handlerConfig = MessageHandlerStore.ofHandlerName(message.handler);
    const queue = handlerConfig?.queue || defaultQueue;

    const labels = {
      delayLabel: envelope.labels.get(DelayLabel.name),
    };

    await this.client.createTask({
      parent: this.client.queuePath(project, region, queue),
      task: {
        ...(labels.delayLabel && {
          scheduleTime: {
            seconds: ((labels.delayLabel as DelayLabel).delayInSeconds + Date.now()) / 1000,
          },
        }),
        name: message.name,
        httpRequest: {
          httpMethod: 'POST',
          url: workerHostUrl,
          body: Buffer.from(serialize(message)),
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
}
