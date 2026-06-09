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
  template: `<canvas #canvas></canvas>`,
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
            legend: {
              position: 'top',
              labels: { color: '#bae6fd', font: { size: 12 }, padding: 16 },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: '#7dd3fc', font: { size: 12 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { precision: 0, color: '#7dd3fc', font: { size: 12 } },
              grid: { color: 'rgba(255,255,255,0.06)' },
            },
          },
        },
      });

      effect(
        () => {
          if (!this.chart) return;
          this.chart.data = this.buildData(this.events());
          this.chart.update();
        },
        { injector: this.injector },
      );
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildData(events = this.events()) {
    const clicksByDate = new Map<string, number>();
    const loadsByDate = new Map<string, number>();

    for (const e of events) {
      const date = e.dateTime.split(' ')[0];
      if (e.action === 'click') clicksByDate.set(date, (clicksByDate.get(date) ?? 0) + 1);
      else loadsByDate.set(date, (loadsByDate.get(date) ?? 0) + 1);
    }

    const allDates = [...new Set([...clicksByDate.keys(), ...loadsByDate.keys()])].sort(
      (a, b) => this.toMs(a) - this.toMs(b),
    );

    return {
      labels: allDates,
      datasets: [
        {
          label: 'Cliques',
          data: allDates.map((d) => clicksByDate.get(d) ?? 0),
          backgroundColor: '#f472b6cc',
          hoverBackgroundColor: '#f472b6',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Carregamentos',
          data: allDates.map((d) => loadsByDate.get(d) ?? 0),
          backgroundColor: '#34d399cc',
          hoverBackgroundColor: '#34d399',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }

  private toMs(date: string): number {
    const [d, m, y] = date.split('/').map(Number);
    return new Date(y, m - 1, d).getTime();
  }
}
