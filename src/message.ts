export class Message {
  public constructor(
    public readonly name: string,
    public readonly handler: string,
    public readonly payload: object,
    public readonly version: string,
  ) {}
}
