import { Routes } from '@angular/router';
import { HomePageComponent } from './home/pages/home-page/home-page.component';


export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'participants',
    loadChildren: () => import ('./participants/participants.routes').then( r => r.PARTICIPANTS_ROUTES)
  },
  {
    path: 'races',
    loadChildren: () => import ('./races/races.routes').then( r=> r.RACES_ROUTES)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
