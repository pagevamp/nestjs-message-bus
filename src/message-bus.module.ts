import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { MessageBus } from './message-bus';
import { MessagePublisher } from './message-publisher';
import { SyncTransport } from './transport/sync';
import { CloudTaskTransport, CloudTaskReceiver, CloudTaskSender } from './transport/cloud-task';
import { TransportResolver, Dispatcher } from './transport';
import { ModuleConfig } from './types';
import { MODULE_CONFIG } from './constant';
import { DummyMessageHandler } from './examples/dummy-message.handler';

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
        CloudTaskReceiver,
        CloudTaskSender,
        SyncTransport,
        MessagePublisher,
        Dispatcher,
        MessageBus,
      ],
      exports: [MessageBus, CloudTaskTransport],
    };
  }
}
