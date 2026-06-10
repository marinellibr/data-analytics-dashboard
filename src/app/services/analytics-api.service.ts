import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { ClickEvent } from '../models/click-event.model';
import { PageLoadEvent } from '../models/page-load-event.model';
import { HttpCallEvent } from '../models/http-call-event.model';
import { Session } from '../models/session.model';

const API_BASE_URL = 'https://data-analytics-backend-two.vercel.app';

export interface AnalyticsData {
  clickEvents: ClickEvent[];
  pageLoadEvents: PageLoadEvent[];
  httpCalls: HttpCallEvent[];
  sessions: Session[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private http = inject(HttpClient);

  getClickEvents(): Observable<ClickEvent[]> {
    return this.http.get<ClickEvent[]>(`${API_BASE_URL}/click-events`);
  }

  getPageLoadEvents(): Observable<PageLoadEvent[]> {
    return this.http.get<PageLoadEvent[]>(`${API_BASE_URL}/page-load-events`);
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
      clickEvents: this.getClickEvents(),
      pageLoadEvents: this.getPageLoadEvents(),
      httpCalls: this.getHttpCalls(),
      sessions: this.getSessions(),
    });
  }
}
