import { ILabel } from './types';

export class DelayLabel implements ILabel {
  constructor(public readonly delayInSeconds: number) {}
}
