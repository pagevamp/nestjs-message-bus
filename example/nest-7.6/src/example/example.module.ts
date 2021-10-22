import { Module } from '@nestjs/common';
import { ExampleMessageHandler } from 'src/example/example.message.handler';

@Module({
  providers: [ExampleMessageHandler],
})
export class ExampleModule {}
