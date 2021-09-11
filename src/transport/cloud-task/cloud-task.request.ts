import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.DEFAULT,
})
export class CloudTaskRequest {
  private body: Record<string, any>;

  setBody(body: any) {
    this.body = body;
  }

  getBody() {
    return this.body;
  }
}
