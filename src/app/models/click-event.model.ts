export interface ClickEvent {
  appID: string;
  sessionID: string;
  location: string;
  element?: string; // CSS selector or element label
  timestamp: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
}
