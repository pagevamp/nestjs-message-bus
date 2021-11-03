import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ILabel } from './label';
import { MessageHandlerStore } from './message-handler-store';
import { IMessage } from './interfaces/message.interface';
import { MessageSender } from './message-sender';
import { Message } from './message';
import { ModuleConfig } from './types';
import { MODULE_CONFIG } from './constant';
import { Envelope } from './envelope';

@Injectable()
export class MessagePublisher {
  private readonly moduleConfig: ModuleConfig;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly messageSender: MessageSender,
  ) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: true });
  }

  async publish(message: IMessage, labels: readonly ILabel[]): Promise<void> {
    const messageName = message.constructor.name;
    const resolvedHandlers = MessageHandlerStore.ofMessageName(messageName);

    if (!resolvedHandlers.length) {
      throw new Error(`Unable to find handler for message: ${messageName}`);
    }

    // Assert all handlers are present
    resolvedHandlers.forEach((item) => {
      this.moduleRef.get(item.handlerName, { strict: false });
    });

    resolvedHandlers.map(async (item) => {
      const envelope = new Envelope(
        new Message(messageName, item.handlerName, message, 'v1'),
        labels,
      );

      const defaultTransport = this.moduleConfig.transport;

      const sender = this.messageSender.resolve(
        item.transport || defaultTransport,
      );

      await sender.send(envelope);
    });
  }
}
