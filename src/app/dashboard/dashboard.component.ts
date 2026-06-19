import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError, shareReplay } from 'rxjs/operators';
import { DropdownComponent, IconComponent, TextComponent, TagComponent } from 'creamy-kit';

import { AnalyticsApiService, AppData } from '../services/analytics-api.service';
import { Activity, ActivityType, ACTIVITY_TYPES, emptyCounts } from '../models/activity';
import { StackedBarChartComponent, ChartSeries } from './components/stacked-bar-chart/stacked-bar-chart.component';

const EMPTY: AppData = { appID: '', activities: [], counts: emptyCounts() };

// "2026-06-18" -> "18/06"
const formatDay = (iso: string): string => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    IconComponent, TextComponent, TagComponent, DropdownComponent,
    StackedBarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
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

  // Re-fetches whenever the :appID route param changes. One request per app
  // via the aggregated /apps/:appID endpoint.
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
      shareReplay(1),
    ),
    { initialValue: EMPTY },
  );

  // App picker
  readonly apps = toSignal(
    this.api.getApps().pipe(catchError(() => of([] as string[]))),
    { initialValue: [] as string[] },
  );
  readonly appOptions = computed(() =>
    this.apps().map((id) => ({ label: id.charAt(0).toUpperCase() + id.slice(1), value: id })),
  );
  selectedAppID = '';

  readonly activities = computed<Activity[]>(() => this.data().activities);
  readonly counts = computed(() => this.data().counts);
  readonly totalActivities = computed(() => this.activities().length);

  // ── Show/hide toggle, shared by both charts ───────────────────────────────
  readonly visibleTypes = signal<Set<ActivityType>>(new Set(ACTIVITY_TYPES.map((t) => t.key)));

  isVisible(type: ActivityType): boolean {
    return this.visibleTypes().has(type);
  }

  toggleType(type: ActivityType): void {
    const next = new Set(this.visibleTypes());
    if (next.has(type)) next.delete(type);
    else next.add(type);
    this.visibleTypes.set(next);
  }

  private readonly activeTypes = computed(() =>
    ACTIVITY_TYPES.filter((t) => this.visibleTypes().has(t.key)),
  );

  // ── Days present in the data ──────────────────────────────────────────────
  readonly days = computed<string[]>(() => {
    const set = new Set<string>();
    for (const a of this.activities()) set.add(a.timestamp.slice(0, 10));
    return [...set].sort();
  });
  readonly dayOptions = computed(() =>
    this.days().map((d) => ({ label: formatDay(d), value: d })),
  );
  readonly selectedDay = signal<string>('');

  // ── Per-day stacked chart ─────────────────────────────────────────────────
  readonly dailySeries = computed<ChartSeries[]>(() => {
    const days = this.days();
    const byDay = new Map<string, Record<ActivityType, number>>();
    for (const d of days) byDay.set(d, emptyCounts());
    for (const a of this.activities()) {
      const rec = byDay.get(a.timestamp.slice(0, 10));
      if (rec) rec[a.type]++;
    }
    return this.activeTypes().map((t) => ({
      label: t.label,
      color: t.color,
      data: days.map((d) => byDay.get(d)![t.key]),
    }));
  });
  readonly dailyLabels = computed(() => this.days().map(formatDay));

  // ── Per-hour chart for the selected day (0–23h) ───────────────────────────
  private readonly hours = Array.from({ length: 24 }, (_, h) => h);
  readonly hourlyLabels = this.hours.map((h) => `${String(h).padStart(2, '0')}h`);

  readonly hourlySeries = computed<ChartSeries[]>(() => {
    const day = this.selectedDay();
    const byHour = this.hours.map(() => emptyCounts());
    for (const a of this.activities()) {
      if (a.timestamp.slice(0, 10) !== day) continue;
      const h = new Date(a.timestamp).getUTCHours();
      byHour[h][a.type]++;
    }
    return this.activeTypes().map((t) => ({
      label: t.label,
      color: t.color,
      data: this.hours.map((h) => byHour[h][t.key]),
    }));
  });

  readonly hasData = computed(() => this.totalActivities() > 0);

  constructor() {
    effect(() => {
      this.selectedAppID = this.appID();
    });
    // Keep the selected day valid: default to the most recent day with data.
    effect(() => {
      const days = this.days();
      if (days.length && !days.includes(this.selectedDay())) {
        this.selectedDay.set(days[days.length - 1]);
      }
    });
  }

  onAppChange(appID: string): void {
    this.router.navigate(['/', appID, 'dashboard']);
  }

  onDayChange(day: string): void {
    this.selectedDay.set(day);
  }

  // Clicking an hour bar opens the detailed breakdown for that hour. The bar
  // index maps 1:1 to the hour (labels are 00h..23h in order).
  onHourClick(hour: number): void {
    const day = this.selectedDay();
    if (!day) return;
    this.router.navigate(['/', this.appID(), 'dashboard', day, hour]);
  }
}
