import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { AnalyticsEvent } from '../models/analytics-event';
import { HttpCallEvent } from '../models/http-call-event.model';
import { Session } from '../models/session.model';

const API_BASE_URL = 'https://data-analytics-backend-two.vercel.app';

export interface AnalyticsData {
  events: AnalyticsEvent[];
  httpCalls: HttpCallEvent[];
  sessions: Session[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private http = inject(HttpClient);

  getEvents(): Observable<AnalyticsEvent[]> {
    return this.http.get<AnalyticsEvent[]>(`${API_BASE_URL}/events`);
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
