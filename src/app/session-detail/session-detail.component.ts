import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IconComponent, TextComponent, TagComponent } from 'creamy-kit';

import { AnalyticsApiService, AppData } from '../services/analytics-api.service';
import { Activity, ACTIVITY_TYPES, emptyCounts } from '../models/activity';
import { ActivityTableComponent } from '../components/activity-table/activity-table.component';

const EMPTY: AppData = { appID: '', activities: [], counts: emptyCounts() };

const pad = (n: number): string => String(n).padStart(2, '0');

// ms -> "1m 23s" / "12s"
const formatDuration = (ms: number): string => {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${pad(s % 60)}s`;
};

// ISO (UTC) -> local "DD/MM/YYYY HH:mm:ss"
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

@Component({
  selector: 'app-session-detail',
  imports: [RouterLink, IconComponent, TextComponent, TagComponent, ActivityTableComponent],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss',
})
export class SessionDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(AnalyticsApiService);

  readonly types = ACTIVITY_TYPES;
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly appID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('appID') ?? '')),
    { initialValue: '' },
  );
  readonly sessionID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('sessionID') ?? '')),
    { initialValue: '' },
  );

  private readonly data = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('appID') ?? ''),
      switchMap((appID) => {
        if (!appID) {
          this.loading.set(false);
          return of(EMPTY);
        }
        this.loading.set(true);
        this.loadError.set(false);
        return this.api.getAppData(appID).pipe(
          tap(() => this.loading.set(false)),
          catchError(() => {
            this.loading.set(false);
            this.loadError.set(true);
            return of(EMPTY);
          }),
        );
      }),
    ),
    { initialValue: EMPTY },
  );

  // Every activity that belongs to this session, in chronological order.
  readonly items = computed<Activity[]>(() => {
    const sid = this.sessionID();
    return this.data().activities
      .filter((a) => a.sessionID === sid)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  });

  readonly total = computed(() => this.items().length);

  readonly counts = computed(() => {
    const c = emptyCounts();
    for (const a of this.items()) c[a.type]++;
    return c;
  });

  // The session-type record carries the device/browser/referrer context.
  readonly session = computed(() => this.items().find((a) => a.type === 'session'));

  readonly startedAt = computed(() => {
    const list = this.items();
    return list.length ? formatDateTime(list[0].timestamp) : '—';
  });

  readonly duration = computed(() => {
    const s = this.session();
    if (s?.endTime && s.timestamp) {
      return formatDuration(new Date(s.endTime).getTime() - new Date(s.timestamp).getTime());
    }
    const list = this.items();
    if (list.length < 2) return '—';
    return formatDuration(
      new Date(list[list.length - 1].timestamp).getTime() - new Date(list[0].timestamp).getTime(),
    );
  });

  // ── Derived metrics ───────────────────────────────────────────────────────
  readonly avgTimeOnPage = computed(() => {
    const views = this.items().filter((a) => a.type === 'pageview' && a.timeOnPage != null);
    if (!views.length) return 0;
    return Math.round(views.reduce((s, a) => s + (a.timeOnPage ?? 0), 0) / views.length);
  });
  readonly httpItems = computed(() => this.items().filter((a) => a.type === 'http'));
  readonly avgDuration = computed(() => {
    const calls = this.httpItems();
    if (!calls.length) return 0;
    return Math.round(calls.reduce((s, a) => s + (a.duration ?? 0), 0) / calls.length);
  });
  readonly errorRate = computed(() => {
    const calls = this.httpItems();
    if (!calls.length) return 0;
    return Math.round((calls.filter((a) => (a.status ?? 0) >= 400).length / calls.length) * 100);
  });
}
