import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";


/** Main application routes */
export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
      path: 'home',
      component: HomeComponent
  },
  {
      path: 'about',
      loadComponent: () =>
          import('./about/about.component').then(m => m.AboutComponent)
  },
];
