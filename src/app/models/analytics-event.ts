export type EventAction = 'click' | 'pageview';

export interface AnalyticsEvent {
  appID: string;
  sessionID: string;
  action: EventAction;
  location: string;
  timestamp: string; // format: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
  timeOnPage?: number; // milliseconds, only for pageview events
}
