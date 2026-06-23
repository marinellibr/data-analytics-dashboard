import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { HttpCallEvent } from '../models/http-call-event.model';
import { Session } from '../models/session.model';
import { Activity, ActivityType, TypeCounts, emptyCounts } from '../models/activity';

const API_BASE_URL = 'https://data-analytics-backend-two.vercel.app';

// Shape stored by the backend / sent by the lib: events carry a `type`
// discriminator ('click' | 'pageview').
interface RawEvent {
  appID: string;
  sessionID: string;
  type: 'click' | 'pageview';
  location: string;
  timestamp: string;
  timeOnPage?: number;
  element?: string;
}

// The aggregated payload returned by GET /apps/:appID
interface RawAppData {
  appID: string;
  events: RawEvent[];
  httpCalls: HttpCallEvent[];
  sessions: Session[];
}

// What the dashboard consumes: a single normalized activity stream plus
// per-type totals.
export interface AppData {
  appID: string;
  activities: Activity[];
  counts: TypeCounts;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private http = inject(HttpClient);

  // List of every app that has data, for the app picker.
  getApps(): Observable<string[]> {
    return this.http.get<string[]>(`${API_BASE_URL}/apps`);
  }

  // All of a single app's data in one request, normalized into activities.
  getAppData(appID: string): Observable<AppData> {
    return this.http
      .get<RawAppData>(`${API_BASE_URL}/apps/${encodeURIComponent(appID)}`)
      .pipe(map((raw) => this.normalize(raw)));
  }

  private normalize(raw: RawAppData): AppData {
    const activities: Activity[] = [
      ...raw.events.map((e) => ({
        type: e.type as ActivityType,
        timestamp: e.timestamp,
        sessionID: e.sessionID,
        location: e.location,
        element: e.element,
        timeOnPage: e.timeOnPage,
      })),
      ...raw.httpCalls.map((h) => ({
        type: 'http' as ActivityType,
        timestamp: h.timestamp,
        sessionID: h.sessionID,
        endpoint: h.endpoint,
        method: h.method,
        status: h.status,
        duration: h.duration,
      })),
      ...raw.sessions.map((s) => ({
        type: 'session' as ActivityType,
        timestamp: s.startTime,
        sessionID: s.sessionID,
        device: s.context?.device,
        browser: s.context?.browser,
        referrer: s.context?.referrer,
        utmSource: s.context?.utmSource,
        country: s.context?.country,
        city: s.context?.city,
        userID: s.userID,
        endTime: s.endTime,
      })),
    ];

    const counts = emptyCounts();
    for (const a of activities) counts[a.type]++;

    return { appID: raw.appID, activities, counts };
  }
}
