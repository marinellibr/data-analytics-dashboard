export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpCallEvent {
  appID: string;
  sessionID: string;
  endpoint: string;
  method: HttpMethod;
  httpStatus: number;
  duration: number; // response time in ms
  dateTime: string; // dd/MM/yyyy hh:mm AM/PM
}
