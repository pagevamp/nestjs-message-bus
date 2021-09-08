import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { MessageHandlerStore } from '../message-handler-store';
import { Message } from '../message';

@Injectable()
export class Dispatcher {
  constructor(private readonly moduleRef: ModuleRef) {}

  async dispatchNow(message: Message): Promise<void> {
    const resolvedHandler = this.moduleRef.get(message.handler, {
      strict: false,
    });

    const reflectedMessage = MessageHandlerStore.reflectMessage(resolvedHandler.constructor);

    if (!reflectedMessage) {
      throw new Error(`Unable to find message: ${message.name}`);
    }

    const hydratedMessage = plainToClass(reflectedMessage, message.payload);
    await resolvedHandler.execute(hydratedMessage);
  }
}
