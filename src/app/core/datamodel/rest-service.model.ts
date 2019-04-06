export class RestServiceModel {
  id: number;
  channelName: string;
  path: string;
  method: string;
  contentType: string;
  // queryParameters: Map;
  requestBody: string;
  requestHeaders: string;
  responseBody: string;
}
