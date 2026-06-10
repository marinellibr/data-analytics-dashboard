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
              labels: { color: '#022f5e', font: { size: 12 }, padding: 16 },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: '#64748b', font: { size: 12 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { precision: 0, color: '#64748b', font: { size: 12 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
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
    const pageviewsByDate = new Map<string, number>();

    for (const e of events) {
      const date = e.timestamp.split('T')[0]; // Extract YYYY-MM-DD from ISO format
      if (e.action === 'click') clicksByDate.set(date, (clicksByDate.get(date) ?? 0) + 1);
      else pageviewsByDate.set(date, (pageviewsByDate.get(date) ?? 0) + 1);
    }

    const allDates = [...new Set([...clicksByDate.keys(), ...pageviewsByDate.keys()])].sort();

    return {
      labels: allDates,
      datasets: [
        {
          label: 'Cliques',
          data: allDates.map((d) => clicksByDate.get(d) ?? 0),
          backgroundColor: '#ed339ccc',
          hoverBackgroundColor: '#ed339c',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Page views',
          data: allDates.map((d) => pageviewsByDate.get(d) ?? 0),
          backgroundColor: '#128cfecc',
          hoverBackgroundColor: '#128cfe',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }
}
