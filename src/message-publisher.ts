import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MessageHandlerStore } from './message-handler-store';
import { IMessage } from './interfaces/message.interface';
import { TransportResolver } from './transport.resolver';
import { Message } from './message';
import { ModuleConfig } from './types';
import { MODULE_CONFIG } from './constant';

@Injectable()
export class MessagePublisher {
  private readonly moduleConfig: ModuleConfig;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly transportResolver: TransportResolver,
  ) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: true });
  }

  async publish(message: IMessage): Promise<void> {
    const messageName = message.constructor.name;
    const resolvedHandlers = MessageHandlerStore.ofMessageName(messageName);

    if (!resolvedHandlers.length) {
      throw new Error(`Unable to find handler for message: ${messageName}`);
    }

    // Assert all handlers are registed tied to message
    resolvedHandlers.forEach((item) => {
      this.moduleRef.get(item.handlerName, { strict: false });
    });

    // TODO: improve later
    resolvedHandlers.forEach(async (item) => {
      this.moduleRef.get(item.handlerName, { strict: false });
      const payload = new Message(messageName, item.handlerName, message, 'v1');
      const defaultTransport = this.moduleConfig.transport;

      const transport = this.transportResolver.sender(item.transport || defaultTransport);
      await transport.send(payload);
    });
  }
}
