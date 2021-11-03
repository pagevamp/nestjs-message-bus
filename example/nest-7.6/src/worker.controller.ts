import { Controller, Get, Post } from '@nestjs/common';
import { MessageBus, Worker, CloudTaskReceiver } from 'nestjs-message-bus';
import { ExampleMessage } from 'src/example/example.message';

@Controller('worker')
export class WorkerController {
  constructor(
    private readonly messageBus: MessageBus,
    private readonly worker: Worker,
    private readonly cloudTaskReceiver: CloudTaskReceiver,
  ) {}

  @Get('/publish-example-message')
  async publishMessage() {
    await this.messageBus.dispatch(new ExampleMessage('Hi there'));
  }

  @Post('/cloud-task')
  async runWorker() {
    return await this.worker.run(this.cloudTaskReceiver);
  }
}
