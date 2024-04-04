import { Routes } from '@angular/router';
import { HomePageComponent } from './home/pages/home-page/home-page.component';


export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'participants',
    loadChildren: () => import( './participants/participants.routes' ).then( r => r.PARTICIPANTS_ROUTES )
  },
  {
    path: 'places',
    loadChildren: () => import( './places/places.routes' ).then( r => r.PLACES_ROUTES )
  },
  {
    path: 'charts',
    loadChildren: () => import( './charts/charts.routes' ).then( r => r.CHARTS_ROUTES )
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
