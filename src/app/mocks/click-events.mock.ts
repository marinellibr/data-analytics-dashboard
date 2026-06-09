import { ClickEvent } from '../models/click-event.model';

export const CLICK_EVENTS_MOCK: ClickEvent[] = [
  // ── CRM ──────────────────────────────────────────────────────────────────
  { appID: 'crm', sessionID: 's001', where: '/crm/contacts',      target: '#btn-new-contact',  dateTime: '05/06/2026 08:31 AM' },
  { appID: 'crm', sessionID: 's001', where: '/crm/contacts',      target: '.contact-row',      dateTime: '05/06/2026 08:33 AM' },
  { appID: 'crm', sessionID: 's002', where: '/crm/deals',         target: '.deal-card',        dateTime: '05/06/2026 10:17 AM' },
  { appID: 'crm', sessionID: 's003', where: '/crm/pipeline',      target: '#btn-add-deal',     dateTime: '06/06/2026 09:05 AM' },
  { appID: 'crm', sessionID: 's004', where: '/crm/contacts/new',  target: '#btn-save-contact', dateTime: '06/06/2026 02:34 PM' },
  { appID: 'crm', sessionID: 's005', where: '/crm/reports',       target: '#btn-export',       dateTime: '07/06/2026 11:10 AM' },
  { appID: 'crm', sessionID: 's006', where: '/crm/dashboard',     target: '#nav-contacts',     dateTime: '08/06/2026 09:46 AM' },
  { appID: 'crm', sessionID: 's007', where: '/crm/pipeline',      target: '.pipeline-stage',   dateTime: '08/06/2026 03:04 PM' },
  { appID: 'crm', sessionID: 's008', where: '/crm/contacts',      target: '#btn-filter',       dateTime: '09/06/2026 08:02 AM' },
  { appID: 'crm', sessionID: 's008', where: '/crm/contacts',      target: '.contact-row',      dateTime: '09/06/2026 08:05 AM' },

  // ── HR ───────────────────────────────────────────────────────────────────
  { appID: 'hr', sessionID: 's009', where: '/hr/employees',    target: '#btn-add-employee',   dateTime: '05/06/2026 09:03 AM' },
  { appID: 'hr', sessionID: 's010', where: '/hr/recruitment',  target: '.job-card',           dateTime: '05/06/2026 11:32 AM' },
  { appID: 'hr', sessionID: 's011', where: '/hr/payroll',      target: '#btn-run-payroll',    dateTime: '06/06/2026 10:05 AM' },
  { appID: 'hr', sessionID: 's011', where: '/hr/reports',      target: '#btn-filter-date',    dateTime: '06/06/2026 10:04 AM' },
  { appID: 'hr', sessionID: 's012', where: '/hr/performance',  target: '.employee-row',       dateTime: '06/06/2026 04:04 PM' },
  { appID: 'hr', sessionID: 's013', where: '/hr/employees',    target: '#btn-export',         dateTime: '07/06/2026 08:35 AM' },
  { appID: 'hr', sessionID: 's014', where: '/hr/dashboard',    target: '#nav-recruitment',    dateTime: '08/06/2026 10:02 AM' },
  { appID: 'hr', sessionID: 's015', where: '/hr/recruitment',  target: '#btn-new-vacancy',    dateTime: '08/06/2026 02:03 PM' },
  { appID: 'hr', sessionID: 's016', where: '/hr/payroll',      target: '.payroll-item',       dateTime: '09/06/2026 09:04 AM' },
  { appID: 'hr', sessionID: 's016', where: '/hr/reports',      target: '#btn-download',       dateTime: '09/06/2026 09:05 AM' },

  // ── Sales ────────────────────────────────────────────────────────────────
  { appID: 'sales', sessionID: 's017', where: '/sales/leads',         target: '#btn-new-lead',         dateTime: '05/06/2026 08:03 AM' },
  { appID: 'sales', sessionID: 's018', where: '/sales/opportunities',  target: '.opportunity-card',     dateTime: '05/06/2026 12:02 PM' },
  { appID: 'sales', sessionID: 's019', where: '/sales/forecast',      target: '#btn-export',           dateTime: '06/06/2026 08:50 AM' },
  { appID: 'sales', sessionID: 's020', where: '/sales/leads',         target: '.lead-row',             dateTime: '06/06/2026 01:33 PM' },
  { appID: 'sales', sessionID: 's021', where: '/sales/territory',     target: '#map-region',           dateTime: '07/06/2026 10:04 AM' },
  { appID: 'sales', sessionID: 's021', where: '/sales/reports',       target: '#btn-filter',           dateTime: '07/06/2026 10:04 AM' },
  { appID: 'sales', sessionID: 's022', where: '/sales/opportunities',  target: '#btn-new-opportunity',  dateTime: '08/06/2026 09:03 AM' },
  { appID: 'sales', sessionID: 's023', where: '/sales/leads',         target: '#btn-import',           dateTime: '08/06/2026 11:32 AM' },
  { appID: 'sales', sessionID: 's024', where: '/sales/forecast',      target: '.forecast-row',         dateTime: '09/06/2026 08:34 AM' },
  { appID: 'sales', sessionID: 's024', where: '/sales/reports',       target: '#btn-export',           dateTime: '09/06/2026 08:36 AM' },

  // ── Finance ──────────────────────────────────────────────────────────────
  { appID: 'finance', sessionID: 's025', where: '/finance/dashboard',      target: '#nav-reconciliation',  dateTime: '05/06/2026 07:31 AM' },
  { appID: 'finance', sessionID: 's025', where: '/finance/invoices',       target: '#btn-new-invoice',     dateTime: '05/06/2026 07:33 AM' },
  { appID: 'finance', sessionID: 's026', where: '/finance/budget',         target: '.budget-item',         dateTime: '05/06/2026 09:35 AM' },
  { appID: 'finance', sessionID: 's027', where: '/finance/expenses',       target: '#btn-add-expense',     dateTime: '06/06/2026 11:03 AM' },
  { appID: 'finance', sessionID: 's028', where: '/finance/reports',        target: '#btn-download',        dateTime: '07/06/2026 09:05 AM' },
  { appID: 'finance', sessionID: 's029', where: '/finance/reconciliation', target: '.transaction-row',     dateTime: '07/06/2026 02:03 PM' },
  { appID: 'finance', sessionID: 's030', where: '/finance/invoices',       target: '.invoice-row',         dateTime: '08/06/2026 10:32 AM' },
  { appID: 'finance', sessionID: 's031', where: '/finance/expenses',       target: '#btn-export',          dateTime: '08/06/2026 03:33 PM' },
  { appID: 'finance', sessionID: 's032', where: '/finance/budget',         target: '#btn-edit-budget',     dateTime: '09/06/2026 07:03 AM' },
  { appID: 'finance', sessionID: 's032', where: '/finance/reports',        target: '#btn-filter-period',   dateTime: '09/06/2026 07:04 AM' },
];
