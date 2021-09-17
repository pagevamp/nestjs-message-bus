import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CloudTaskRequest } from './cloud-task.request';

@Injectable()
export class CloudTaskRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    CloudTaskRequest.setBody(request.body);

    return next.handle();
  }
}
