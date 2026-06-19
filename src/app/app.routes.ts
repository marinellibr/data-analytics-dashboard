import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HourDetailComponent } from './hour-detail/hour-detail.component';

export const routes: Routes = [
  { path: ':appID/dashboard/:day/:hour', component: HourDetailComponent },
  { path: ':appID/dashboard', component: DashboardComponent },
  // No app selected yet — the dashboard shows the "select an app" state.
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
