import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HourDetailComponent } from './hour-detail/hour-detail.component';
import { TimeBandDetailComponent } from './time-band-detail/time-band-detail.component';

export const routes: Routes = [
  { path: ':appID/dashboard/:day/band/:band', component: TimeBandDetailComponent },
  { path: ':appID/dashboard/:day/:hour', component: HourDetailComponent },
  { path: ':appID/dashboard', component: DashboardComponent },
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
