import { Type } from '@nestjs/common';
import { MessageHandlerOption } from './types';
import { IMessage } from './interfaces/message.interface';
import { IMessageHandler } from './interfaces/message-handler.interface';

export class MessageHandlerStore {
  public static value = new Array<{
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
    if (!MessageHandlerStore.exists(message, handlerClass)) {
      MessageHandlerStore.value.push({
        messageName: message.name,
        handlerName: handlerClass.name,
        transport: option?.transport,
        queue: option?.queue,
        metadata: {
          messageClass: message,
        },
      });
    }
  }

  public static ofMessageName(message: string) {
    return MessageHandlerStore.value.filter(
      (item) => item.messageName === message,
    );
  }

  public static ofHandlerName(handler: string) {
    return MessageHandlerStore.value.find(
      (item) => item.handlerName === handler,
    );
  }

  public static reflectMessageClass(messageName: string) {
    const messageHandler = MessageHandlerStore.value.find(
      (item) => item.messageName === messageName,
    );

    if (!messageHandler) {
      throw new Error(`Unable to find message item : ${messageName}`);
    }

    return messageHandler.metadata.messageClass;
  }

  private static exists(
    message: Type<IMessage>,
    handler: Type<IMessageHandler<any>>,
  ) {
    const messageHandler = MessageHandlerStore.value.find(
      (item) =>
        item.messageName === message.name && item.handlerName === handler.name,
    );

    return !!messageHandler;
  }

  public static clear() {
    MessageHandlerStore.value = [];
  }
}
