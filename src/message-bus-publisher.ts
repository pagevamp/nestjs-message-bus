import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MessageHandlerStore } from './message-handler-store';
import { IMessage } from './interfaces/message.interface';
import { IMessageHandler } from './interfaces/message-handler.interface';
import { TransportResolver } from './transport';
import { Message } from './message';
import { ModuleConfig, Transport } from './types';
import { MODULE_CONFIG } from './constant';

@Injectable()
export class MessageBusPublisher {
  private readonly moduleConfig: ModuleConfig;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly transportResolver: TransportResolver,
  ) {
    this.moduleConfig = this.moduleRef.get(MODULE_CONFIG, { strict: true });
  }

  async publish(message: IMessage): Promise<void> {
    const messageName = message.constructor.name;
    const resolvedMessage = MessageHandlerStore.ofMessageName(messageName);

    if (!resolvedMessage) {
      throw new Error(`Unable to find handler for message: ${messageName}`);
    }

    this.moduleRef.get<IMessageHandler>(resolvedMessage.handlerName, {
      strict: false,
    });

    const payload = new Message(
      messageName,
      resolvedMessage.handlerName,
      message,
      'v1',
    );

    const defaultTransport = this.moduleConfig.taskBusTransport as Transport;
    const transport = this.transportResolver.resolve(
      resolvedMessage.transport || defaultTransport,
    );

    await transport.publish(payload);
  }
}
