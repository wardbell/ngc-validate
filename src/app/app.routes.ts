import { Routes } from '@angular/router';
import { CompanyFormComponent } from "@app/company-form/company-form.component";
import { CompanyFormComponent as CompanyFormReactiveComponent } from "@app/company-form-reactive/company-form.component";
import { AddressFormComponent } from '@app/test-address-forms/address-form-reactive-w-val/address-form.component';


/** Main application routes */
export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'company'
  },
  {
    path: 'company',
    component: CompanyFormComponent,
    title: 'Company'
  },
  {
    path: 'company-reactive',
    component: CompanyFormReactiveComponent,
    title: 'Company (Reactive)'
  },
  {
    path: 'test-address',
    component: AddressFormComponent,
    title: 'Test Address'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(m => m.AboutComponent),
    title: 'About'
  },
];
