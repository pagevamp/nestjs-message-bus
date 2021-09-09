import { Type } from '@nestjs/common';
import { MessageHandlerOption } from './types';
import { IMessage } from './interfaces/message.interface';
import { IMessageHandler } from './interfaces/message-handler.interface';
import { APP_MESSAGE_QUEUE_METADATA } from './constant';

export class MessageHandlerStore {
  private static readonly value = new Map<
    string,
    {
      readonly handlerName: string;
      readonly transport?: string;
      readonly queue?: string;
    }
  >();

  static registerHandler(
    message: Type<IMessage>,
    handlerClass: Type<IMessageHandler<any>>,
    option?: MessageHandlerOption,
  ) {
    MessageHandlerStore.value.set(message.name, {
      handlerName: handlerClass.name,
      transport: option?.transport,
      queue: option?.queue,
    });

    Reflect.defineMetadata(APP_MESSAGE_QUEUE_METADATA, message, handlerClass);
  }

  public static ofMessageName(task: string) {
    return MessageHandlerStore.value.get(task);
  }

  public static clear() {
    MessageHandlerStore.value.clear();
  }

  public static reflectMessage(handlerClass: Function): FunctionConstructor {
    return Reflect.getMetadata(APP_MESSAGE_QUEUE_METADATA, handlerClass);
  }
}
