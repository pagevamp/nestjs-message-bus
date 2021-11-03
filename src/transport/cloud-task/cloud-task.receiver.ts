import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Envelope } from '../../envelope';
import { Message } from '../../message';
import { IReceiver } from '../types';

@Injectable({
  scope: Scope.REQUEST,
})
export class CloudTaskReceiver implements IReceiver {
  constructor(
    @Inject(REQUEST)
    private readonly request: Record<string, any>,
  ) {}

  async *get() {
    const body = this.request.body;
    const message = new Message(body.name, body.handler, body.payload, body.version);

    yield new Envelope(message, new Map([]));
  }
}
