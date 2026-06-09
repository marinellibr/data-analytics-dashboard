import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DropdownComponent, IconComponent, TagComponent, TextComponent } from 'creamy-kit';

import { ANALYTICS_EVENTS_MOCK } from '../mocks/analytics-events.mock';
import { SESSIONS_MOCK } from '../mocks/sessions.mock';
import { PAGE_LOAD_EVENTS_MOCK } from '../mocks/page-load-events.mock';
import { HTTP_CALLS_MOCK } from '../mocks/http-calls.mock';
import { AnalyticsEvent } from '../models/analytics-event';
import { ActionChartComponent } from './components/action-chart/action-chart.component';
import { LocationChartComponent } from './components/location-chart/location-chart.component';
import { TimelineChartComponent } from './components/timeline-chart/timeline-chart.component';
import { DeviceChartComponent } from './components/device-chart/device-chart.component';
import { ReferrerChartComponent } from './components/referrer-chart/referrer-chart.component';
import { HttpStatusChartComponent } from './components/http-status-chart/http-status-chart.component';
import { ResponseTimeChartComponent } from './components/response-time-chart/response-time-chart.component';

const uniqueAppIDs = [...new Set(ANALYTICS_EVENTS_MOCK.map((e) => e.appID))].sort();

type TabID = 'overview' | 'sessions' | 'http' | 'events';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    IconComponent, TextComponent, TagComponent, DropdownComponent,
    ActionChartComponent, LocationChartComponent, TimelineChartComponent,
    DeviceChartComponent, ReferrerChartComponent,
    HttpStatusChartComponent, ResponseTimeChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly appOptions = uniqueAppIDs.map((id) => ({
    label: id.charAt(0).toUpperCase() + id.slice(1),
    value: id,
  }));

  readonly appID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('appID') ?? '')),
    { initialValue: '' },
  );

  selectedAppID = '';
  readonly selectedTab = signal<TabID>('overview');

  readonly tabs: { id: TabID; label: string; icon: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: 'dashboard' },
    { id: 'sessions', label: 'Sessões',      icon: 'people' },
    { id: 'http',     label: 'HTTP',         icon: 'http' },
    { id: 'events',   label: 'Eventos',      icon: 'list' },
  ];

  readonly events = computed<AnalyticsEvent[]>(() =>
    ANALYTICS_EVENTS_MOCK.filter((e) => e.appID === this.appID()),
  );
  readonly totalClicks = computed(() => this.events().filter((e) => e.action === 'click').length);
  readonly totalPageLoads = computed(() => this.events().filter((e) => e.action === 'loadPage').length);

  readonly sessions = computed(() => SESSIONS_MOCK.filter((s) => s.appID === this.appID()));
  readonly totalSessions = computed(() => this.sessions().length);

  readonly pageLoads = computed(() => PAGE_LOAD_EVENTS_MOCK.filter((e) => e.appID === this.appID()));
  readonly avgTimeOnPage = computed(() => {
    const loads = this.pageLoads();
    if (!loads.length) return 0;
    return Math.round(loads.reduce((sum, e) => sum + e.timeOnPage, 0) / loads.length / 1000);
  });

  readonly httpCalls = computed(() => HTTP_CALLS_MOCK.filter((e) => e.appID === this.appID()));
  readonly totalHttpCalls = computed(() => this.httpCalls().length);
  readonly errorRate = computed(() => {
    const calls = this.httpCalls();
    if (!calls.length) return 0;
    return Math.round((calls.filter((c) => c.httpStatus >= 400).length / calls.length) * 100);
  });
  readonly avgDuration = computed(() => {
    const calls = this.httpCalls();
    if (!calls.length) return 0;
    return Math.round(calls.reduce((sum, c) => sum + c.duration, 0) / calls.length);
  });

  constructor() {
    effect(() => { this.selectedAppID = this.appID(); });
  }

  onAppChange(appID: string): void {
    this.router.navigate(['/', appID, 'dashboard']);
  }
}
