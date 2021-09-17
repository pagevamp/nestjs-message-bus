export class CloudTaskRequest {
  private static body: Record<string, any>;

  static setBody(body: any) {
    CloudTaskRequest.body = body;
  }

  static getBody() {
    return CloudTaskRequest.body;
  }
}
