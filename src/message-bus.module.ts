import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { MessageBus } from './message-bus';
import { MessageBusPublisher } from './message-bus-publisher';
import {
  CloudTaskTransport,
  TransportResolver,
  SyncTransport,
} from './transport';
import { ModuleConfig } from './types';
import { MODULE_CONFIG } from './constant';
import { DummyMessageHandler } from './examples/dummy-message.handler';
import { MessageExecutor } from './message-executor';

@Module({})
export class MessageBusModule {
  static register(config: ModuleConfig): DynamicModule {
    const ModuleConfigProvider: ValueProvider<ModuleConfig> = {
      provide: MODULE_CONFIG,
      useValue: config,
    };

    return {
      module: MessageBusModule,
      providers: [
        DummyMessageHandler,
        ModuleConfigProvider,
        TransportResolver,
        CloudTaskTransport,
        SyncTransport,
        MessageBusPublisher,
        MessageExecutor,
        MessageBus,
      ],
      exports: [MessageBus, CloudTaskTransport],
    };
  }
}
