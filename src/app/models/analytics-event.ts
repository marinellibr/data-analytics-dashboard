export type EventAction = 'click' | 'loadPage';

export interface AnalyticsEvent {
  appID: string;
  action: EventAction;
  where: string;
  dateTime: string; // format: dd/MM/yyyy hh:mm AM/PM
}
