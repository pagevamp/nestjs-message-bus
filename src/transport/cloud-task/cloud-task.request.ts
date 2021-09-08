import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class CloudTaskRequest {
  constructor(@Inject(REQUEST) private request: Request) {}

  getBody() {
    return this.request.body;
  }
}
