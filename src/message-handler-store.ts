import { Type } from '@nestjs/common';
import { MessageHandlerOption } from './types';
import { IMessage } from './interfaces/message.interface';
import { IMessageHandler } from './interfaces/message-handler.interface';

export class MessageHandlerStore {
  public static value = new Set<{
    messageName: string;
    handlerName: string;
    transport?: string;
    queue?: string;
    metadata: {
      messageClass: Type<IMessage>;
    };
  }>();

  static registerHandler(
    message: Type<IMessage>,
    handlerClass: Type<IMessageHandler<any>>,
    option?: MessageHandlerOption,
  ) {
    MessageHandlerStore.value.add({
      messageName: message.name,
      handlerName: handlerClass.name,
      transport: option?.transport,
      queue: option?.queue,
      metadata: {
        messageClass: message,
      },
    });
  }

  public static ofMessageName(message: string) {
    return Array.from(MessageHandlerStore.value).filter((item) => item.messageName === message);
  }

  public static ofHandlerName(handler: string) {
    return Array.from(MessageHandlerStore.value).find((item) => item.handlerName === handler);
  }

  public static reflectMessageClass(messageName: string) {
    const messageHandler = Array.from(MessageHandlerStore.value).find(
      (item) => item.messageName === messageName,
    );

    if (!messageHandler) {
      throw new Error(`Unable to find message item : ${messageName}`);
    }

    return messageHandler.metadata.messageClass;
  }

  public static clear() {
    MessageHandlerStore.value.clear();
  }
}
