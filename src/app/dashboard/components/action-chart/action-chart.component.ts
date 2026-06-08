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
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js';

import { AnalyticsEvent } from '../../../models/analytics-event';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-action-chart',
  template: `
    <div class="chart-card">
      <p class="chart-title">Distribuição de ações</p>
      <div class="canvas-wrapper">
        <canvas #canvas></canvas>
      </div>
    </div>
  `,
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
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, font: { size: 13 } } },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` } },
          },
          cutout: '65%',
        },
      });

      effect(
        () => {
          const e = this.events();
          if (!this.chart) return;
          const d = this.buildData(e);
          this.chart.data.datasets[0].data = d.datasets[0].data;
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(events = this.events()) {
    const clicks = events.filter((e) => e.action === 'click').length;
    const loads = events.filter((e) => e.action === 'loadPage').length;
    return {
      labels: ['Cliques', 'Carregamentos'],
      datasets: [
        {
          data: [clicks, loads],
          backgroundColor: ['#6366f1', '#22c55e'],
          hoverBackgroundColor: ['#4f46e5', '#16a34a'],
          borderWidth: 0,
        },
      ],
    };
  }
}
