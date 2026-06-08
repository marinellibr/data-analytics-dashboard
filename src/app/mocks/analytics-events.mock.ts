import { AnalyticsEvent } from '../models/analytics-event';

export const ANALYTICS_EVENTS_MOCK: AnalyticsEvent[] = [
  // crm
  { appID: 'crm', action: 'loadPage', where: '/crm/contacts',        dateTime: '08/06/2026 09:00 AM' },
  { appID: 'crm', action: 'click',    where: 'button#new-contact',   dateTime: '08/06/2026 09:02 AM' },
  { appID: 'crm', action: 'click',    where: 'link#contact-42',      dateTime: '08/06/2026 09:05 AM' },
  { appID: 'crm', action: 'loadPage', where: '/crm/contacts/42',     dateTime: '08/06/2026 09:05 AM' },
  { appID: 'crm', action: 'click',    where: 'button#save-contact',  dateTime: '08/06/2026 09:08 AM' },
  { appID: 'crm', action: 'loadPage', where: '/crm/deals',           dateTime: '08/06/2026 10:15 AM' },
  { appID: 'crm', action: 'click',    where: 'button#add-deal',      dateTime: '08/06/2026 10:17 AM' },

  // hr
  { appID: 'hr', action: 'loadPage', where: '/hr/employees',         dateTime: '07/06/2026 08:30 AM' },
  { appID: 'hr', action: 'click',    where: 'link#employee-7',       dateTime: '07/06/2026 08:32 AM' },
  { appID: 'hr', action: 'loadPage', where: '/hr/employees/7',       dateTime: '07/06/2026 08:32 AM' },
  { appID: 'hr', action: 'click',    where: 'tab#vacation',          dateTime: '07/06/2026 08:35 AM' },
  { appID: 'hr', action: 'click',    where: 'button#approve-leave',  dateTime: '07/06/2026 08:37 AM' },
  { appID: 'hr', action: 'loadPage', where: '/hr/payroll',           dateTime: '07/06/2026 02:00 PM' },
  { appID: 'hr', action: 'click',    where: 'button#run-payroll',    dateTime: '07/06/2026 02:05 PM' },

  // sales
  { appID: 'sales', action: 'loadPage', where: '/sales/pipeline',         dateTime: '06/06/2026 11:00 AM' },
  { appID: 'sales', action: 'click',    where: 'card#opportunity-19',     dateTime: '06/06/2026 11:03 AM' },
  { appID: 'sales', action: 'loadPage', where: '/sales/opportunities/19', dateTime: '06/06/2026 11:03 AM' },
  { appID: 'sales', action: 'click',    where: 'button#advance-stage',    dateTime: '06/06/2026 11:06 AM' },
  { appID: 'sales', action: 'click',    where: 'button#export-report',    dateTime: '06/06/2026 03:30 PM' },
  { appID: 'sales', action: 'loadPage', where: '/sales/reports',          dateTime: '06/06/2026 03:30 PM' },

  // finance
  { appID: 'finance', action: 'loadPage', where: '/finance/overview',       dateTime: '05/06/2026 10:00 AM' },
  { appID: 'finance', action: 'click',    where: 'tab#expenses',            dateTime: '05/06/2026 10:02 AM' },
  { appID: 'finance', action: 'click',    where: 'button#new-expense',      dateTime: '05/06/2026 10:04 AM' },
  { appID: 'finance', action: 'loadPage', where: '/finance/invoices',       dateTime: '05/06/2026 01:15 PM' },
  { appID: 'finance', action: 'click',    where: 'button#mark-paid-inv-33', dateTime: '05/06/2026 01:18 PM' },
];
