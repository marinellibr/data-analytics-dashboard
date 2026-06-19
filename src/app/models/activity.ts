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
