import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { HttpCallEvent } from '../../../models/http-call-event.model';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const TOP_N = 8;

@Component({
  selector: 'app-response-time-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class ResponseTimeChartComponent {
  readonly httpCalls = input.required<HttpCallEvent[]>();

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
          plugins: { legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw}ms` } },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { font: { size: 11 }, color: '#64748b',
                callback: (v) => `${v}ms`,
              },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              ticks: {
                font: { size: 10, family: 'monospace' },
                color: '#022f5e',
                callback: (_, i, ticks) => {
                  const label = (ticks[i] as { label: string }).label ?? '';
                  return label.length > 28 ? label.slice(0, 27) + '…' : label;
                },
              },
              grid: { display: false },
            },
          },
        },
      });

      effect(() => {
        if (!this.chart) return;
        this.chart.data = this.buildData(this.httpCalls());
        this.chart.update();
      }, { injector: this.injector });
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(calls = this.httpCalls()) {
    const grouped = new Map<string, number[]>();
    for (const c of calls) {
      const key = `${c.method} ${c.endpoint}`;
      const arr = grouped.get(key) ?? [];
      arr.push(c.duration);
      grouped.set(key, arr);
    }
    const sorted = [...grouped.entries()]
      .map(([k, durs]) => [k, Math.round(durs.reduce((s, d) => s + d, 0) / durs.length)] as [string, number])
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N);

    return {
      labels: sorted.map(([l]) => l),
      datasets: [{
        data: sorted.map(([, v]) => v),
        backgroundColor: sorted.map(([, v]) => v > 1000 ? '#ef444488' : '#128cfe88'),
        hoverBackgroundColor: sorted.map(([, v]) => v > 1000 ? '#ef4444' : '#128cfe'),
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }
}
