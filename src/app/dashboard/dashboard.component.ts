import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CardComponent, IconComponent } from 'creamy-kit';

import { ANALYTICS_EVENTS_MOCK } from '../mocks/analytics-events.mock';
import { AnalyticsEvent } from '../models/analytics-event';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);

  readonly appID = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('appID') ?? '')),
    { initialValue: '' },
  );

  readonly events = computed<AnalyticsEvent[]>(() =>
    ANALYTICS_EVENTS_MOCK.filter((e) => e.appID === this.appID()),
  );

  readonly totalClicks = computed(() =>
    this.events().filter((e) => e.action === 'click').length,
  );

  readonly totalPageLoads = computed(() =>
    this.events().filter((e) => e.action === 'loadPage').length,
  );
}
