import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IconComponent, TextComponent, TagComponent } from 'creamy-kit';

import { AnalyticsApiService, AppData } from '../services/analytics-api.service';
import { Activity, ActivityType, ACTIVITY_TYPES, emptyCounts } from '../models/activity';

const EMPTY: AppData = { appID: '', activities: [], counts: emptyCounts() };

// "2026-06-18" -> "18/06/2026"
const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

@Component({
  selector: 'app-hour-detail',
  imports: [RouterLink, IconComponent, TextComponent, TagComponent],
  templateUrl: './hour-detail.component.html',
  styleUrl: './hour-detail.component.scss',
})
export class HourDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(AnalyticsApiService);

  readonly types = ACTIVITY_TYPES;
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly appID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('appID') ?? '')),
    { initialValue: '' },
  );
  readonly day = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('day') ?? '')),
    { initialValue: '' },
  );
  readonly hour = toSignal(
    this.route.paramMap.pipe(map((p) => Number(p.get('hour') ?? 0))),
    { initialValue: 0 },
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

  // Activities that fall inside the selected day + hour, sorted by time.
  readonly items = computed<Activity[]>(() => {
    const day = this.day();
    const hour = this.hour();
    return this.data().activities
      .filter((a) => a.timestamp.slice(0, 10) === day && new Date(a.timestamp).getUTCHours() === hour)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  });

  readonly total = computed(() => this.items().length);

  readonly counts = computed(() => {
    const c = emptyCounts();
    for (const a of this.items()) c[a.type]++;
    return c;
  });

  // ── Derived metrics for richer context ────────────────────────────────────
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

  readonly uniqueSessions = computed(() => {
    const set = new Set<string>();
    for (const a of this.items()) if (a.sessionID) set.add(a.sessionID);
    return set.size;
  });

  // ── Labels ────────────────────────────────────────────────────────────────
  readonly dateLabel = computed(() => (this.day() ? formatDate(this.day()) : ''));
  readonly hourRange = computed(() => {
    const h = String(this.hour()).padStart(2, '0');
    return `${h}:00 – ${h}:59 UTC`;
  });

  typeColor(type: ActivityType): string {
    return ACTIVITY_TYPES.find((t) => t.key === type)?.color ?? '#64748b';
  }
  typeLabel(type: ActivityType): string {
    return ACTIVITY_TYPES.find((t) => t.key === type)?.label ?? type;
  }

  // "2026-06-18T14:32:45.123Z" -> "14:32:45"
  timeOf(iso: string): string {
    return iso.slice(11, 19);
  }
}
