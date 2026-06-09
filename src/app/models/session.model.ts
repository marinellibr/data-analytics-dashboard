export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface Session {
  sessionID: string;
  appID: string;
  device: DeviceType;
  browser: string;
  referrer: string;
  startedAt: string; // dd/MM/yyyy hh:mm AM/PM
}
