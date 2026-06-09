export interface ClickEvent {
  appID: string;
  sessionID: string;
  where: string;
  target: string; // CSS selector or element label
  dateTime: string; // dd/MM/yyyy hh:mm AM/PM
}
