import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip, Legend } from 'chart.js';
import { HttpCallEvent } from '../../../models/http-call-event.model';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-http-status-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class HttpStatusChartComponent {
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
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { font: { size: 12 }, color: '#022f5e' },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: { precision: 0, font: { size: 11 }, color: '#64748b' },
              grid: { color: 'rgba(0,0,0,0.05)' },
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
    return {
      labels: ['2xx  Sucesso', '4xx  Cliente', '5xx  Servidor'],
      datasets: [{
        data: [
          calls.filter(c => c.status >= 200 && c.status < 300).length,
          calls.filter(c => c.status >= 400 && c.status < 500).length,
          calls.filter(c => c.status >= 500).length,
        ],
        backgroundColor: ['#128cfe', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#0070d4', '#d97706', '#dc2626'],
        borderRadius: 8,
        borderSkipped: false,
      }],
    };
  }
}
