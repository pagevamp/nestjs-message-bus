import { Injectable, NestMiddleware } from '@nestjs/common';
import { CloudTaskRequest } from './cloud-task.request';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly cloudTaskRequest: CloudTaskRequest) {}

  use(request: any, _response: any, next: any) {
    this.cloudTaskRequest.setBody(request.body);
    next();
  }
}
