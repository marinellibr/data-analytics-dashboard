import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IconComponent, TextComponent, TagComponent } from 'creamy-kit';

import { AnalyticsApiService, AppData } from '../services/analytics-api.service';
import { Activity, ACTIVITY_TYPES, emptyCounts, localDay, localHour } from '../models/activity';
import { ActivityTableComponent } from '../components/activity-table/activity-table.component';

const EMPTY: AppData = { appID: '', activities: [], counts: emptyCounts() };

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

@Component({
  selector: 'app-hour-detail',
  imports: [RouterLink, IconComponent, TextComponent, TagComponent, ActivityTableComponent],
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

  readonly items = computed<Activity[]>(() => {
    const day = this.day();
    const hour = this.hour();
    return this.data().activities
      .filter((a) => localDay(a.timestamp) === day && localHour(a.timestamp) === hour)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  });

  readonly total = computed(() => this.items().length);

  // sessionID -> visitor geo, built from every session in the app so any row
  // can show its location even if the session record isn't among the rows.
  readonly sessionGeo = computed(() => {
    const map: Record<string, { country?: string; city?: string }> = {};
    for (const a of this.data().activities) {
      if (a.type === 'session' && a.sessionID) {
        map[a.sessionID] = { country: a.country, city: a.city };
      }
    }
    return map;
  });

  readonly counts = computed(() => {
    const c = emptyCounts();
    for (const a of this.items()) c[a.type]++;
    return c;
  });

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

  readonly dateLabel = computed(() => (this.day() ? formatDate(this.day()) : ''));
  readonly hourRange = computed(() => {
    const h = String(this.hour()).padStart(2, '0');
    return `${h}:00 – ${h}:59 (horário local)`;
  });
}
