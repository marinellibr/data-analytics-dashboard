import {
  Component, DestroyRef, ElementRef, Injector, ViewChild,
  afterNextRender, effect, inject, input,
} from '@angular/core';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { Session } from '../../../models/session.model';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-device-chart',
  template: `<canvas #canvas></canvas>`,
  styles: [':host { display: block; position: absolute; inset: 0; }'],
})
export class DeviceChartComponent {
  readonly sessions = input.required<Session[]>();

  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'doughnut'>;
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'doughnut',
        data: this.buildData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 14, font: { size: 11 }, color: '#022f5e' },
            },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } },
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
    return {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [
          sessions.filter(s => s.device === 'desktop').length,
          sessions.filter(s => s.device === 'mobile').length,
          sessions.filter(s => s.device === 'tablet').length,
        ],
        backgroundColor: ['#128cfe', '#ed339c', '#022f5e'],
        hoverBackgroundColor: ['#0070d4', '#c4197e', '#011d3a'],
        borderWidth: 0,
      }],
    };
  }
}
