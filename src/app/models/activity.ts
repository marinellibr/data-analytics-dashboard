export type ActivityType = 'click' | 'pageview' | 'http' | 'session';

// A single normalized unit of activity, derived from any of the backend's
// collections (events split into click/pageview, http-calls, sessions).
export interface Activity {
  type: ActivityType;
  timestamp: string; // ISO 8601 (UTC)
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
