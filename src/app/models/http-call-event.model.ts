export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpCallEvent {
  appID: string;
  sessionID: string;
  endpoint: string;
  method: HttpMethod;
  status: number; // HTTP status code
  duration: number; // response time in milliseconds
  timestamp: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
}
