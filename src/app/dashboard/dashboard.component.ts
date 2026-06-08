import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CardComponent, DropdownComponent, IconComponent } from 'creamy-kit';

import { ANALYTICS_EVENTS_MOCK } from '../mocks/analytics-events.mock';
import { AnalyticsEvent } from '../models/analytics-event';
import { ActionChartComponent } from './components/action-chart/action-chart.component';
import { LocationChartComponent } from './components/location-chart/location-chart.component';
import { TimelineChartComponent } from './components/timeline-chart/timeline-chart.component';

const uniqueAppIDs = [...new Set(ANALYTICS_EVENTS_MOCK.map((e) => e.appID))].sort();

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CardComponent,
    IconComponent,
    DropdownComponent,
    ActionChartComponent,
    LocationChartComponent,
    TimelineChartComponent,
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

  // Tracks dropdown selection — kept in sync with route param
  selectedAppID = '';

  readonly events = computed<AnalyticsEvent[]>(() =>
    ANALYTICS_EVENTS_MOCK.filter((e) => e.appID === this.appID()),
  );

  readonly totalClicks = computed(() =>
    this.events().filter((e) => e.action === 'click').length,
  );

  readonly totalPageLoads = computed(() =>
    this.events().filter((e) => e.action === 'loadPage').length,
  );

  constructor() {
    effect(() => {
      this.selectedAppID = this.appID();
    });
  }

  onAppChange(appID: string): void {
    this.router.navigate(['/', appID, 'dashboard']);
  }
}
