# Project Title

Nest-Js Message Bus

## Description

Message Bus implementation as a nest js module. As of now it supports `sync` and `cloud-task` transport.

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

Setup up a worker for cloud task, worker url must be same as `workerHostUrl` which is configured above.

```

@Controller()
export class WorkerController {

  constructor(
    private readonly worker: Worker, 
    private readonly receiver: CloudTaskReceiver,
  ) {}

  @Post('/cloud-task-worker')
  async runWorker() {
    await this.worker.run(this.receiver);
  }

}

```

## Usage

Create a message and associated handler.

- Message Handler is called immediately if `sync` transport is used.
- Message Handler call is deferred (queued) using google cloud task service if `cloud-task` transport is used.


```
export class ExampleMessage implements IMessage {
  constructor(public readonly body: string) {}
}


@MessageHandler(ExampleMessage)
export class ExampleMessageHandler implements IMessageHandler<ExampleMessage> {
  execute(message: ExampleMessage): Promise<void> {
    return Promise.resolve();
  }
}


@Injectable()
export class SomeService {
  constructor(
    private readonly messageBus: MessageBus,
  ) { }

  async exampleMethod() {
    await this.messageBus.dispatch(
      new ExampleMessage('content..'),
    );
  }

}

```

## Delayed Delivery

There are times when message execution must occur at a later time. Delaying a message is done using `DelayLabel`. Simply add a delay label with delay time in seconds when dispatching.

```
await this.messageBus.dispatch(
  new ExampleMessage('content..'), [
    new DelayLabel(600),
  ],
)
```

`ExampleMessage` will be delivered after 10 minutes delay. Max supported delay depends on the transport you're using.


## Testing

```
npm run test
```
