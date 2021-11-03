import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { MessageBus } from './message-bus';
import { MessagePublisher } from './message-publisher';
import { CloudTaskModule } from './transport/cloud-task';
import { SyncModule } from './transport/sync';
import { MessageSender } from './message-sender';
import { Dispatcher } from './dispatcher';
import { ModuleConfig } from './types';
import { MODULE_CONFIG } from './constant';
import { DummyMessageHandler } from './examples/dummy-message.handler';
import { Worker } from './worker';

@Module({})
export class MessageBusModule {
  static register(config: ModuleConfig): DynamicModule {
    const ModuleConfigProvider: ValueProvider<ModuleConfig> = {
      provide: MODULE_CONFIG,
      useValue: config,
    };

    return {
      module: MessageBusModule,
      global: true,
      imports: [SyncModule, CloudTaskModule],
      providers: [
        DummyMessageHandler,
        ModuleConfigProvider,
        MessageSender,
        MessagePublisher,
        Dispatcher,
        MessageBus,
        Worker,
      ],
      exports: [MessageBus, Worker],
    };
  }
}
