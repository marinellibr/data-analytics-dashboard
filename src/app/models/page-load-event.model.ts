export interface PageLoadEvent {
  appID: string;
  sessionID: string;
  location: string;
  timeOnPage: number; // milliseconds
  timestamp: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
}
