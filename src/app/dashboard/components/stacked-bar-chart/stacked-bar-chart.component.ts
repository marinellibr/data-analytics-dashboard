import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export interface ChartSeries {
  label: string;
  data: number[];
  color: string;
}

// Generic stacked vertical bar chart. The parent supplies labels and the
// series to render; visibility toggling is handled upstream by simply
// omitting hidden series, so the same component powers both the per-day and
// the per-hour charts.
@Component({
  selector: 'app-stacked-bar-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class StackedBarChartComponent {
  readonly labels = input.required<string[]>();
  readonly series = input.required<ChartSeries[]>();

  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'bar'>;
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: { labels: this.labels(), datasets: this.buildDatasets() },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: '#64748b', font: { size: 11 }, autoSkip: true, maxRotation: 0 },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { precision: 0, color: '#64748b', font: { size: 11 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
          },
        },
      });

      effect(
        () => {
          if (!this.chart) return;
          this.chart.data.labels = this.labels();
          this.chart.data.datasets = this.buildDatasets();
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildDatasets() {
    return this.series().map((s) => ({
      label: s.label,
      data: s.data,
      backgroundColor: s.color,
      borderRadius: 4,
      borderSkipped: false as const,
    }));
  }
}
