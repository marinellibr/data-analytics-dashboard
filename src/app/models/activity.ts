export type ActivityType = 'click' | 'pageview' | 'http' | 'session';

// A single normalized unit of activity, derived from any of the backend's
// collections (events split into click/pageview, http-calls, sessions).
// Type-specific fields are optional and populated only for the relevant type,
// so a detail view can show the full record behind each bar.
export interface Activity {
  type: ActivityType;
  timestamp: string; // ISO 8601 (UTC)
  sessionID?: string;

  // click / pageview
  location?: string;
  element?: string;
  timeOnPage?: number; // ms

  // http
  endpoint?: string;
  method?: string;
  status?: number;
  duration?: number; // ms

  // session
  device?: string;
  browser?: string;
  referrer?: string;
  userID?: string;
  endTime?: string;
}

export interface TypeConfig {
  key: ActivityType;
  label: string;
  color: string;
}

export const ACTIVITY_TYPES: TypeConfig[] = [
  { key: 'click',    label: 'Cliques',    color: '#128cfe' },
  { key: 'pageview', label: 'Page views', color: '#ed339c' },
  { key: 'http',     label: 'HTTP',       color: '#f59e0b' },
  { key: 'session',  label: 'Sessões',    color: '#0ea5a4' },
];

export type TypeCounts = Record<ActivityType, number>;

export const emptyCounts = (): TypeCounts => ({ click: 0, pageview: 0, http: 0, session: 0 });

// Timestamps are stored in UTC (ISO 8601 with Z). The dashboard groups and
// displays everything in the viewer's local timezone, so a user in GMT-3 sees
// the hour the event actually happened for them — not the UTC hour.

const pad = (n: number): string => String(n).padStart(2, '0');

// ISO (UTC) -> local "YYYY-MM-DD"
export const localDay = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// ISO (UTC) -> local hour (0–23)
export const localHour = (iso: string): number => new Date(iso).getHours();

// ISO (UTC) -> local "HH:mm:ss"
export const localTime = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
