import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import {
  CloudTaskRequestInterceptor,
  MessageBus,
  Worker,
} from 'nestjs-message-bus';
import { ExampleMessage } from 'src/example/example.message';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly messageBus: MessageBus,
    private worker: Worker,
  ) {}

  @Get('/publish-example-message')
  async publishMessage() {
    await this.messageBus.dispatch(new ExampleMessage('Hi there'));
  }

  @Post('/cloud-task')
  @UseInterceptors(CloudTaskRequestInterceptor)
  async runWorker() {
    return await this.worker.run('cloud-task');
  }
}
