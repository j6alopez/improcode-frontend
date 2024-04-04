import { Routes } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { PlacesPageComponent as PlacesPageComponent } from "./pages/places-page/places-page.component";

export const PLACES_ROUTES: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', component: PlacesPageComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
