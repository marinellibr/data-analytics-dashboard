import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { IconComponent, TextComponent, TagComponent } from 'creamy-kit';

import { AnalyticsApiService, AppData } from '../services/analytics-api.service';
import { Activity, ActivityType, ACTIVITY_TYPES, emptyCounts, localDay, localHour } from '../models/activity';
import { ActivityTableComponent } from '../components/activity-table/activity-table.component';
import { StackedBarChartComponent, ChartSeries } from '../dashboard/components/stacked-bar-chart/stacked-bar-chart.component';

type BandKey = 'madrugada' | 'manha' | 'tarde' | 'noite';

interface BandConfig {
  label: string;
  hours: number[];
  range: string;
}

const BANDS: Record<BandKey, BandConfig> = {
  madrugada: { label: 'Madrugada', hours: [0, 1, 2, 3, 4, 5],       range: '00:00 – 05:59' },
  manha:     { label: 'Manhã',     hours: [6, 7, 8, 9, 10, 11],      range: '06:00 – 11:59' },
  tarde:     { label: 'Tarde',     hours: [12, 13, 14, 15, 16, 17],  range: '12:00 – 17:59' },
  noite:     { label: 'Noite',     hours: [18, 19, 20, 21, 22, 23],  range: '18:00 – 23:59' },
};

const EMPTY: AppData = { appID: '', activities: [], counts: emptyCounts() };

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

@Component({
  selector: 'app-time-band-detail',
  imports: [RouterLink, IconComponent, TextComponent, TagComponent, ActivityTableComponent, StackedBarChartComponent],
  templateUrl: './time-band-detail.component.html',
  styleUrl: './time-band-detail.component.scss',
})
export class TimeBandDetailComponent {
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
  readonly bandKey = toSignal(
    this.route.paramMap.pipe(map((p) => (p.get('band') ?? 'manha') as BandKey)),
    { initialValue: 'manha' as BandKey },
  );

  readonly bandConfig = computed<BandConfig>(() => BANDS[this.bandKey()] ?? BANDS['manha']);

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
    const hourSet = new Set(this.bandConfig().hours);
    return this.data().activities
      .filter((a) => localDay(a.timestamp) === day && hourSet.has(localHour(a.timestamp)))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  });

  readonly total = computed(() => this.items().length);

  readonly counts = computed(() => {
    const c = emptyCounts();
    for (const a of this.items()) c[a.type]++;
    return c;
  });

  // ── Mini per-hour stacked chart ──────────────────────────────────────────
  readonly hourLabels = computed(() =>
    this.bandConfig().hours.map((h) => `${String(h).padStart(2, '0')}h`)
  );

  readonly hourSeries = computed<ChartSeries[]>(() => {
    const hours = this.bandConfig().hours;
    const byHour = new Map<number, Record<ActivityType, number>>();
    for (const h of hours) byHour.set(h, emptyCounts());
    for (const a of this.items()) {
      const rec = byHour.get(localHour(a.timestamp));
      if (rec) rec[a.type]++;
    }
    return ACTIVITY_TYPES.map((t) => ({
      label: t.label,
      color: t.color,
      data: hours.map((h) => byHour.get(h)![t.key]),
    }));
  });

  // ── Labels ────────────────────────────────────────────────────────────────
  readonly dateLabel = computed(() => (this.day() ? formatDate(this.day()) : ''));

  onHourBarClick(index: number): void {
    const day = this.day();
    if (!day) return;
    const hour = this.bandConfig().hours[index];
    this.router.navigate(['/', this.appID(), 'dashboard', day, hour]);
  }
}
