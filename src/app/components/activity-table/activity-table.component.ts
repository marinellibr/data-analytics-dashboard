import { Component, computed, input, signal } from '@angular/core';
import { Activity, ActivityType, ACTIVITY_TYPES, localTime } from '../../models/activity';

type TabKey = 'all' | ActivityType;

@Component({
  selector: 'app-activity-table',
  imports: [],
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss',
})
export class ActivityTableComponent {
  readonly items = input.required<Activity[]>();

  readonly types = ACTIVITY_TYPES;
  readonly activeTab = signal<TabKey>('all');

  readonly tabCounts = computed(() => {
    const counts: Record<string, number> = { all: this.items().length };
    for (const t of ACTIVITY_TYPES) {
      counts[t.key] = this.items().filter((a) => a.type === t.key).length;
    }
    return counts;
  });

  readonly visibleItems = computed<Activity[]>(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.items() : this.items().filter((a) => a.type === tab);
  });

  readonly showTypeColumn = computed(() => this.activeTab() === 'all');

  setTab(key: TabKey): void {
    this.activeTab.set(key);
  }

  typeColor(type: ActivityType): string {
    return ACTIVITY_TYPES.find((t) => t.key === type)?.color ?? '#64748b';
  }
  typeLabel(type: ActivityType): string {
    return ACTIVITY_TYPES.find((t) => t.key === type)?.label ?? type;
  }
  timeOf(iso: string): string {
    return localTime(iso);
  }
}
