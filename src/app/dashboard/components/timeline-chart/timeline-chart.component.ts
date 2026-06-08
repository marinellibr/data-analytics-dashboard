import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  ViewChild,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

import { AnalyticsEvent } from '../../../models/analytics-event';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-timeline-chart',
  template: `
    <div class="chart-card">
      <p class="chart-title">Eventos por data</p>
      <div class="canvas-wrapper">
        <canvas #canvas></canvas>
      </div>
    </div>
  `,
  styleUrl: './timeline-chart.component.scss',
})
export class TimelineChartComponent {
  readonly events = input.required<AnalyticsEvent[]>();

  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'bar'>;

  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: this.buildData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {},
          },
          scales: {
            x: {
              stacked: true,
              ticks: { font: { size: 12 } },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { precision: 0, font: { size: 12 } },
              grid: { color: '#f3f4f6' },
            },
          },
        },
      });

      effect(
        () => {
          const e = this.events();
          if (!this.chart) return;
          const d = this.buildData(e);
          this.chart.data = d;
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(events = this.events()) {
    // Parse "dd/MM/yyyy hh:mm AM/PM" → extract date part
    const clicksByDate = new Map<string, number>();
    const loadsByDate = new Map<string, number>();

    for (const e of events) {
      const date = e.dateTime.split(' ')[0]; // "dd/MM/yyyy"
      if (e.action === 'click') {
        clicksByDate.set(date, (clicksByDate.get(date) ?? 0) + 1);
      } else {
        loadsByDate.set(date, (loadsByDate.get(date) ?? 0) + 1);
      }
    }

    // Build unified sorted date labels
    const allDates = [...new Set([...clicksByDate.keys(), ...loadsByDate.keys()])].sort(
      (a, b) => this.dateToMs(a) - this.dateToMs(b),
    );

    return {
      labels: allDates,
      datasets: [
        {
          label: 'Cliques',
          data: allDates.map((d) => clicksByDate.get(d) ?? 0),
          backgroundColor: '#6366f1cc',
          hoverBackgroundColor: '#6366f1',
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Carregamentos',
          data: allDates.map((d) => loadsByDate.get(d) ?? 0),
          backgroundColor: '#22c55ecc',
          hoverBackgroundColor: '#22c55e',
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }

  // "dd/MM/yyyy" → milliseconds for sorting
  private dateToMs(date: string): number {
    const [d, m, y] = date.split('/').map(Number);
    return new Date(y, m - 1, d).getTime();
  }
}
