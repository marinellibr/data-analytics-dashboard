export interface PageLoadEvent {
  appID: string;
  sessionID: string;
  where: string;
  timeOnPage: number; // ms
  dateTime: string; // dd/MM/yyyy hh:mm AM/PM
}
