export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface SessionContext {
  device: DeviceType;
  browser: string;
  referrer: string;
  utmSource?: string; // marketing attribution (utm_source), optional
  country?: string; // ISO country code, enriched server-side from edge geo
  city?: string; // city name, enriched server-side from edge geo
}

export interface Session {
  sessionID: string;
  appID: string;
  userID?: string;
  context: SessionContext;
  startTime: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
  endTime?: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
}
