import { ExecutionContext, Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({
  // scope: Scope.REQUEST,
})
export class CloudTaskRequest {
  // constructor(@Inject(REQUEST) private request: Record<string, any>) {}

  getBody() {
    return {
      name: 'SendEmailMessage',
      handler: 'SendEmailMessageHandler',
      payload: { emailAddress: 'random@gmail.com', text: 'Hi there' },
      version: 'v1',
    }
  }
}
