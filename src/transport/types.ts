import { Envelope } from '../envelope';

export interface ISender {
  readonly send: (envelope: Envelope) => Promise<void>;
}

export interface IReceiver {
  readonly get: () => AsyncGenerator<Envelope>;
}
