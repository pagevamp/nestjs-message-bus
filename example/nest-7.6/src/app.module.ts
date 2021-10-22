import { Module } from '@nestjs/common';
import { MessageBusModule } from 'nestjs-message-bus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleModule } from 'src/example/example.module';
import { WorkerController } from 'src/worker.controller';

@Module({
  imports: [
    ExampleModule,
    MessageBusModule.register({
      transport: 'cloud-task',
    }),
  ],
  controllers: [AppController, WorkerController],
  providers: [AppService],
})
export class AppModule {}
