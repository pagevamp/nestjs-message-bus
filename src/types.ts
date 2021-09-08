import { Message } from './message';

export enum Transport {
  CLOUD_TASK = 'cloud-task',
  SYNC = 'sync',
}

export interface ITransport {
  readonly send: (message: Message) => Promise<void>;
  readonly get: () => Promise<any>; // TODO: change
}

export interface MessageHandlerOption {
  readonly transport?: Transport;
  readonly queue?: string;
}

export interface CloudTaskConfig {
  readonly project: string;
  readonly region: string;
  readonly serviceAccountEmail: string;
  readonly workerHostUrl: string;
  readonly defaultQueue: string;
}

export interface ModuleConfig {
  readonly transport: string;
  readonly cloudTask?: CloudTaskConfig;
}
