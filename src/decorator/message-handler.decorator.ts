import { Type } from '@nestjs/common';
import { MessageHandlerStore } from '../message-handler-store';
import { IMessage } from '../interfaces/message.interface';
import { IMessageHandler } from '../interfaces/message-handler.interface';
import { MessageHandlerOption } from '../types';

export const MessageHandler = (
  message: IMessage,
  option?: MessageHandlerOption,
): ClassDecorator => {
  return (target: object) => {
    MessageHandlerStore.registerHandler(
      message as Type<IMessage>,
      target as Type<IMessageHandler<any>>,
      option,
    );
  };
};
