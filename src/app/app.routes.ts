import { Routes } from '@angular/router';
import { AirbnbComponent } from './dashboards/airbnb/airbnb.component';

export const routes: Routes = [
  { path: '', component: AirbnbComponent }, // or loadComponent: () => import(...).then(m => m.AirbnbComponent)
];
