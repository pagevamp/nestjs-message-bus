import { Message } from './message';

export enum Transport {
  CLOUD_TASK = 'cloud-task',
  SYNC = 'sync',
}

export interface ITransport {
  readonly publish: (message: Message) => Promise<void>;
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
  readonly taskBusTransport: string;
  readonly cloudTask?: CloudTaskConfig;
}
