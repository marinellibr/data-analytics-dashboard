import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

// Generic doughnut chart. The parent supplies parallel labels/values arrays;
// slice colors are taken from `colors` when provided, otherwise drawn from a
// built-in palette in order.
@Component({
  selector: 'app-pie-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class PieChartComponent {
  readonly labels = input.required<string[]>();
  readonly data = input.required<number[]>();
  readonly colors = input<string[]>([]);

  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'doughnut'>;
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  private readonly palette = [
    '#128cfe', '#ed339c', '#f59e0b', '#0ea5a4', '#7c3aed',
    '#ef4444', '#14b8a6', '#eab308', '#3b82f6', '#64748b',
  ];

  constructor() {
    afterNextRender(() => {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'doughnut',
        data: { labels: this.labels(), datasets: [this.buildDataset()] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '58%',
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#475569', font: { size: 12 }, boxWidth: 12, padding: 10 },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const ds = ctx.dataset.data as number[];
                  const total = ds.reduce((s, v) => s + (v ?? 0), 0);
                  const val = ctx.parsed ?? 0;
                  const pct = total ? Math.round((val / total) * 100) : 0;
                  return ` ${ctx.label}: ${val} (${pct}%)`;
                },
              },
            },
          },
        },
      });

      effect(
        () => {
          if (!this.chart) return;
          this.chart.data.labels = this.labels();
          this.chart.data.datasets = [this.buildDataset()];
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildDataset() {
    const provided = this.colors();
    const colors = provided.length
      ? provided
      : this.labels().map((_, i) => this.palette[i % this.palette.length]);
    return {
      data: this.data(),
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: '#fff',
    };
  }
}
