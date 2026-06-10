import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { Session } from '../../../models/session.model';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

@Component({
  selector: 'app-referrer-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class ReferrerChartComponent {
  readonly sessions = input.required<Session[]>();

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
              ticks: { precision: 0, font: { size: 11 }, color: '#64748b' },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              ticks: { font: { size: 11 }, color: '#022f5e' },
              grid: { display: false },
            },
          },
        },
      });

      effect(() => {
        if (!this.chart) return;
        this.chart.data = this.buildData(this.sessions());
        this.chart.update();
      }, { injector: this.injector });
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(sessions = this.sessions()) {
    const counts = new Map<string, number>();
    for (const s of sessions) counts.set(s.context.referrer, (counts.get(s.context.referrer) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([l]) => l),
      datasets: [{
        data: sorted.map(([, v]) => v),
        backgroundColor: '#128cfe88',
        hoverBackgroundColor: '#128cfe',
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }
}
