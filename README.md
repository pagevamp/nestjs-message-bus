# Project Title

Nest-Js Message Bus

## Description

Message Bus implementation as a nest js module. Currently it can execute task using transport `sync` and `cloud-task`

## Setup

Import `MessageBusModule` with following configuration

```

@Module({
  imports: [
    MessageBusModule.register({
      transport: 'cloud-task',
      cloudTask: {
        defaultQueue: 'default',
        project: '',
        region: '',
        serviceAccountEmail: ''
        workerHostUrl: process.env.HOST + '/cloud-task-worker'
    })
  ]
})


```

Setup up a worker for cloud-task, worker url must be same as `workerHostUrl` which is configured above.

```

@Controller()
export class WorkerController {

  @Post('/cloud-task-worker')
  @UseInterceptors(CloudTaskRequestInterceptor)
  async runWorker() {
    await this.worker.run('cloud-task');
  }

}

```

## Usage

Create a message and associated handler which get's called upon message dispatch.

- Message Handler is called immediately if `sync` transport is used.
- Message Handler call is deferred (queued) using google cloud task service if `cloud-task` transport is used.


```
export class DummyMessage implements IMessage {
  constructor(public readonly message: string) {}
}


@MessageHandler(DummyMessage)
export class DummyMessageHandler implements IMessageHandler<DummyMessage> {
  execute(message: DummyMessage): Promise<void> {
    return Promise.resolve();
  }
}


@Injectable()
export class SomeService {
  constructor(
    private readonly messageBus: MessageBus,
  ) { }

  async exampleMethod() {
    // ...

    await this.messageBus.dispatch(
      new DummyMessage('Hi there..'),
    );

    // ...
  }

}

```
