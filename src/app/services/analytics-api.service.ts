import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { AnalyticsEvent, EventAction } from '../models/analytics-event';
import { HttpCallEvent } from '../models/http-call-event.model';
import { Session } from '../models/session.model';

const API_BASE_URL = 'https://data-analytics-backend-two.vercel.app';

// Shape stored by the backend / sent by the lib: events carry a `type`
// discriminator ('click' | 'pageview'), which the dashboard surfaces as `action`.
interface RawEvent {
  appID: string;
  sessionID: string;
  type: EventAction;
  location: string;
  timestamp: string;
  timeOnPage?: number;
  element?: string;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  httpCalls: HttpCallEvent[];
  sessions: Session[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private http = inject(HttpClient);

  getEvents(): Observable<AnalyticsEvent[]> {
    return this.http.get<RawEvent[]>(`${API_BASE_URL}/events`).pipe(
      map((events) =>
        events.map((e) => ({
          appID: e.appID,
          sessionID: e.sessionID,
          action: e.type,
          location: e.location,
          timestamp: e.timestamp,
          timeOnPage: e.timeOnPage,
        })),
      ),
    );
  }

  getHttpCalls(): Observable<HttpCallEvent[]> {
    return this.http.get<HttpCallEvent[]>(`${API_BASE_URL}/http-calls`);
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${API_BASE_URL}/sessions`);
  }

  // Fetches every collection in parallel so the dashboard can populate at once
  getAll(): Observable<AnalyticsData> {
    return forkJoin({
      events: this.getEvents(),
      httpCalls: this.getHttpCalls(),
      sessions: this.getSessions(),
    });
  }
}
