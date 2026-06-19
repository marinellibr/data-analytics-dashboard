import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: ':appID/dashboard', component: DashboardComponent },
  // No app selected yet — the dashboard shows the "select an app" state.
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
