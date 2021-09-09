export interface MessageHandlerOption {
  readonly transport?: string;
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
