import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { MessageHandlerStore } from './message-handler-store';
import { Message } from './message';

@Injectable()
export class MessageExecutor {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(message: Message): Promise<void> {
    const resolvedHandler = this.moduleRef.get(message.handler, {
      strict: false,
    });
    const reflectedMessage = MessageHandlerStore.reflectTask(
      resolvedHandler.constructor,
    );

    if (!reflectedMessage) {
      throw new Error(`Unable to find message: ${message.name}`);
    }

    const hydratedTask = plainToClass(reflectedMessage, message.payload);
    await resolvedHandler.execute(hydratedTask);
  }
}
