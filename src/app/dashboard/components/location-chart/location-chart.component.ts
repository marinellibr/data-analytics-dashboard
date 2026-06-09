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
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { AnalyticsEvent } from '../../../models/analytics-event';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const TOP_N = 8;

@Component({
  selector: 'app-location-chart',
  template: `<canvas #canvas></canvas>`,
  styleUrl: './location-chart.component.scss',
})
export class LocationChartComponent {
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
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { precision: 0, font: { size: 12 }, color: '#6b21a8' },
              grid: { color: '#f3e8ff' },
            },
            y: {
              ticks: {
                font: { size: 12, family: 'monospace' },
                color: '#6b21a8',
                callback: (_, i, ticks) => {
                  const label = (ticks[i] as { label: string }).label ?? '';
                  return label.length > 30 ? label.slice(0, 29) + '…' : label;
                },
              },
              grid: { display: false },
            },
          },
        },
      });

      effect(
        () => {
          if (!this.chart) return;
          const d = this.buildData(this.events());
          this.chart.data = d;
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(events = this.events()) {
    const counts = new Map<string, number>();
    for (const e of events) counts.set(e.where, (counts.get(e.where) ?? 0) + 1);

    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP_N);

    return {
      labels: sorted.map(([l]) => l),
      datasets: [{
        data: sorted.map(([, v]) => v),
        backgroundColor: '#c026d388',
        hoverBackgroundColor: '#c026d3',
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }
}
