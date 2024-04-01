import { Routes } from '@angular/router';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { ChartsPageComponent } from './pages/charts-page/charts-page.component';

export const CHARTS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', component: ChartsPageComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
