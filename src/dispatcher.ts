import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { deserialize } from 'class-transformer';
import { MessageHandlerStore } from './message-handler-store';
import { Message } from './message';

@Injectable()
export class Dispatcher {
  constructor(private readonly moduleRef: ModuleRef) {}

  async dispatchNow(message: Message): Promise<void> {
    const resolvedHandler = this.moduleRef.get(message.handler, {
      strict: false,
    });

    const reflectedMessage = MessageHandlerStore.reflectMessageClass(
      message.name,
    );

    const hydratedMessage = deserialize(
      reflectedMessage,
      JSON.stringify(message.payload),
    );

    await resolvedHandler.execute(message.payload);
  }
}
