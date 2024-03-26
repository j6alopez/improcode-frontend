import { Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ParticipantsListPageComponent } from './pages/participants-page/participants-page.component';
import { ParticipantPageComponent } from './pages/participant-page/participant-page.component';

export const PARTICIPANTS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
          { path: '', component: ParticipantsListPageComponent },
          { path: ':id', component: ParticipantPageComponent },
          { path: '**', redirectTo: 'home' },
      ],
  },
];
