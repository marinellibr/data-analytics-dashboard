import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { DropdownComponent, IconComponent, TagComponent, TextComponent, TooltipComponent } from 'creamy-kit';

import { AnalyticsApiService, AnalyticsData } from '../services/analytics-api.service';
import { AnalyticsEvent } from '../models/analytics-event';
import { HttpCallEvent } from '../models/http-call-event.model';
import { Session } from '../models/session.model';
import { ActionChartComponent } from './components/action-chart/action-chart.component';
import { LocationChartComponent } from './components/location-chart/location-chart.component';
import { TimelineChartComponent } from './components/timeline-chart/timeline-chart.component';
import { DeviceChartComponent } from './components/device-chart/device-chart.component';
import { ReferrerChartComponent } from './components/referrer-chart/referrer-chart.component';
import { HttpStatusChartComponent } from './components/http-status-chart/http-status-chart.component';
import { ResponseTimeChartComponent } from './components/response-time-chart/response-time-chart.component';

type TabID = 'overview' | 'sessions' | 'http' | 'events';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    IconComponent, TextComponent, TagComponent, DropdownComponent, TooltipComponent,
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
  private api = inject(AnalyticsApiService);

  readonly loading = signal(true);
  readonly loadError = signal(false);

  private static readonly EMPTY: AnalyticsData = {
    events: [], httpCalls: [], sessions: [],
  };

  // Single request to the backend on Vercel, shared by every derived signal
  private readonly data = toSignal(
    this.api.getAll().pipe(
      tap(() => this.loading.set(false)),
      catchError(() => {
        this.loading.set(false);
        this.loadError.set(true);
        return of(DashboardComponent.EMPTY);
      }),
      shareReplay(1),
    ),
    { initialValue: DashboardComponent.EMPTY },
  );

  private readonly allEvents = computed<AnalyticsEvent[]>(() => this.data().events);
  private readonly httpCalls_ = computed<HttpCallEvent[]>(() => this.data().httpCalls);
  private readonly sessions_ = computed<Session[]>(() => this.data().sessions);

  readonly appOptions = computed(() => {
    const ids = [...new Set(this.allEvents().map((e) => e.appID))].sort();
    return ids.map((id) => ({
      label: id.charAt(0).toUpperCase() + id.slice(1),
      value: id,
    }));
  });

  readonly appID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('appID') ?? '')),
    { initialValue: '' },
  );

  selectedAppID = '';
  readonly selectedTab = signal<TabID>('overview');

  readonly tabs: { id: TabID; label: string; icon: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: 'house_base' },
    { id: 'sessions', label: 'Sessões',      icon: 'user_base' },
    { id: 'http',     label: 'HTTP',         icon: 'code_base' },
    { id: 'events',   label: 'Eventos',      icon: 'list_base' },
  ];

  readonly currentTabLabel = computed(() =>
    this.tabs.find(t => t.id === this.selectedTab())?.label ?? '',
  );

  readonly events = computed<AnalyticsEvent[]>(() =>
    this.allEvents().filter((e) => e.appID === this.appID()),
  );
  readonly totalClicks = computed(() => this.events().filter((e) => e.action === 'click').length);
  readonly totalPageLoads = computed(() => this.events().filter((e) => e.action === 'pageview').length);

  readonly sessions = computed(() => this.sessions_().filter((s) => s.appID === this.appID()));
  readonly totalSessions = computed(() => this.sessions().length);

  readonly pageLoads = computed(() => this.events().filter((e) => e.action === 'pageview' && e.timeOnPage));
  readonly avgTimeOnPage = computed(() => {
    const loads = this.pageLoads();
    if (!loads.length) return 0;
    return Math.round(loads.reduce((sum, e) => sum + (e.timeOnPage || 0), 0) / loads.length / 1000);
  });

  readonly httpCalls = computed(() => this.httpCalls_().filter((e) => e.appID === this.appID()));
  readonly totalHttpCalls = computed(() => this.httpCalls().length);
  readonly errorRate = computed(() => {
    const calls = this.httpCalls();
    if (!calls.length) return 0;
    return Math.round((calls.filter((c) => c.status >= 400).length / calls.length) * 100);
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
