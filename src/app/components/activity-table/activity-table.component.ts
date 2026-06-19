import { Component, input } from '@angular/core';
import { Activity, ActivityType, ACTIVITY_TYPES, localTime } from '../../models/activity';

// Full, sortable-by-time list of activities with type-specific details.
// Shared by the hour and time-band detail views.
@Component({
  selector: 'app-activity-table',
  imports: [],
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss',
})
export class ActivityTableComponent {
  readonly items = input.required<Activity[]>();

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
