import { Session } from '../models/session.model';

export const SESSIONS_MOCK: Session[] = [
  // ── CRM (s001–s008) ──────────────────────────────────────────────────────
  { sessionID: 's001', appID: 'crm', device: 'desktop', browser: 'Chrome 124',  referrer: 'google.com',        startedAt: '05/06/2026 08:30 AM' },
  { sessionID: 's002', appID: 'crm', device: 'mobile',  browser: 'Safari 17',   referrer: 'direct',            startedAt: '05/06/2026 10:15 AM' },
  { sessionID: 's003', appID: 'crm', device: 'desktop', browser: 'Firefox 125', referrer: 'linkedin.com',      startedAt: '06/06/2026 09:00 AM' },
  { sessionID: 's004', appID: 'crm', device: 'tablet',  browser: 'Safari 17',   referrer: 'direct',            startedAt: '06/06/2026 02:30 PM' },
  { sessionID: 's005', appID: 'crm', device: 'desktop', browser: 'Edge 124',    referrer: 'email-newsletter',  startedAt: '07/06/2026 11:00 AM' },
  { sessionID: 's006', appID: 'crm', device: 'mobile',  browser: 'Chrome 124',  referrer: 'google.com',        startedAt: '08/06/2026 09:45 AM' },
  { sessionID: 's007', appID: 'crm', device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',            startedAt: '08/06/2026 03:00 PM' },
  { sessionID: 's008', appID: 'crm', device: 'desktop', browser: 'Firefox 125', referrer: 'google.com',        startedAt: '09/06/2026 08:00 AM' },

  // ── HR (s009–s016) ───────────────────────────────────────────────────────
  { sessionID: 's009', appID: 'hr',  device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',            startedAt: '05/06/2026 09:00 AM' },
  { sessionID: 's010', appID: 'hr',  device: 'mobile',  browser: 'Safari 17',   referrer: 'google.com',        startedAt: '05/06/2026 11:30 AM' },
  { sessionID: 's011', appID: 'hr',  device: 'desktop', browser: 'Edge 124',    referrer: 'linkedin.com',      startedAt: '06/06/2026 10:00 AM' },
  { sessionID: 's012', appID: 'hr',  device: 'tablet',  browser: 'Chrome 124',  referrer: 'direct',            startedAt: '06/06/2026 04:00 PM' },
  { sessionID: 's013', appID: 'hr',  device: 'desktop', browser: 'Firefox 125', referrer: 'email-newsletter',  startedAt: '07/06/2026 08:30 AM' },
  { sessionID: 's014', appID: 'hr',  device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',            startedAt: '08/06/2026 10:00 AM' },
  { sessionID: 's015', appID: 'hr',  device: 'mobile',  browser: 'Safari 17',   referrer: 'google.com',        startedAt: '08/06/2026 02:00 PM' },
  { sessionID: 's016', appID: 'hr',  device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',            startedAt: '09/06/2026 09:00 AM' },

  // ── Sales (s017–s024) ────────────────────────────────────────────────────
  { sessionID: 's017', appID: 'sales', device: 'desktop', browser: 'Chrome 124',  referrer: 'google.com',      startedAt: '05/06/2026 08:00 AM' },
  { sessionID: 's018', appID: 'sales', device: 'mobile',  browser: 'Chrome 124',  referrer: 'linkedin.com',    startedAt: '05/06/2026 12:00 PM' },
  { sessionID: 's019', appID: 'sales', device: 'desktop', browser: 'Safari 17',   referrer: 'direct',          startedAt: '06/06/2026 08:45 AM' },
  { sessionID: 's020', appID: 'sales', device: 'tablet',  browser: 'Safari 17',   referrer: 'email-newsletter',startedAt: '06/06/2026 01:30 PM' },
  { sessionID: 's021', appID: 'sales', device: 'desktop', browser: 'Firefox 125', referrer: 'google.com',      startedAt: '07/06/2026 10:00 AM' },
  { sessionID: 's022', appID: 'sales', device: 'desktop', browser: 'Edge 124',    referrer: 'direct',          startedAt: '08/06/2026 09:00 AM' },
  { sessionID: 's023', appID: 'sales', device: 'mobile',  browser: 'Safari 17',   referrer: 'google.com',      startedAt: '08/06/2026 11:30 AM' },
  { sessionID: 's024', appID: 'sales', device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',          startedAt: '09/06/2026 08:30 AM' },

  // ── Finance (s025–s032) ──────────────────────────────────────────────────
  { sessionID: 's025', appID: 'finance', device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',          startedAt: '05/06/2026 07:30 AM' },
  { sessionID: 's026', appID: 'finance', device: 'desktop', browser: 'Edge 124',    referrer: 'email-newsletter',startedAt: '05/06/2026 09:30 AM' },
  { sessionID: 's027', appID: 'finance', device: 'mobile',  browser: 'Safari 17',   referrer: 'google.com',      startedAt: '06/06/2026 11:00 AM' },
  { sessionID: 's028', appID: 'finance', device: 'desktop', browser: 'Firefox 125', referrer: 'direct',          startedAt: '07/06/2026 09:00 AM' },
  { sessionID: 's029', appID: 'finance', device: 'desktop', browser: 'Chrome 124',  referrer: 'direct',          startedAt: '07/06/2026 02:00 PM' },
  { sessionID: 's030', appID: 'finance', device: 'tablet',  browser: 'Safari 17',   referrer: 'google.com',      startedAt: '08/06/2026 10:30 AM' },
  { sessionID: 's031', appID: 'finance', device: 'desktop', browser: 'Chrome 124',  referrer: 'email-newsletter',startedAt: '08/06/2026 03:30 PM' },
  { sessionID: 's032', appID: 'finance', device: 'desktop', browser: 'Edge 124',    referrer: 'direct',          startedAt: '09/06/2026 07:00 AM' },
];
