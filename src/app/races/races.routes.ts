import { Routes } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { RacePageComponent } from "./pages/race-page/race-page.component";

export const RACES_ROUTES: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', component: RacePageComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
