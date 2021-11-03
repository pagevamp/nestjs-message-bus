import { ILabel } from './label';
import { Message } from './message';

export class Envelope {
  constructor(
    public readonly message: Message,
    public readonly labels: readonly ILabel[] = [],
  ) {}

  get labelsMap() {
    return new Map(this.labels.map((label) => [label.constructor.name, label]));
  }
}
