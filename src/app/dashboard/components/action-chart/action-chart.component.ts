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
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { AnalyticsEvent } from '../../../models/analytics-event';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-action-chart',
  template: `<canvas #canvas></canvas>`,
  styleUrl: './action-chart.component.scss',
})
export class ActionChartComponent {
  readonly events = input.required<AnalyticsEvent[]>();

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
          cutout: '68%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, font: { size: 12 }, color: '#022f5e' },
            },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } },
          },
        },
      });

      effect(
        () => {
          if (!this.chart) return;
          const d = this.buildData(this.events());
          this.chart.data.datasets[0].data = d.datasets[0].data;
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(events = this.events()) {
    return {
      labels: ['Cliques', 'Carregamentos'],
      datasets: [{
        data: [
          events.filter((e) => e.action === 'click').length,
          events.filter((e) => e.action === 'loadPage').length,
        ],
        backgroundColor: ['#128cfe', '#ed339c'],
        hoverBackgroundColor: ['#0070d4', '#c4197e'],
        borderWidth: 0,
      }],
    };
  }
}
