import { Injectable } from '@nestjs/common';
import { ITransport } from 'types';

@Injectable()
export class Worker {
  run(transport: ITransport) {}
}
