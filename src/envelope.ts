import { ILabel } from './label';
import { Message } from './message';

export class Envelope {
  constructor(
    public readonly message: Message,
    public readonly labels: Map<string, ILabel> = new Map(),
  ) {}
}
