import { Routes } from '@angular/router';
import { AddressFormComponent } from '@app/test-address-forms/address-form-reactive-w-val/address-form.component';
import { CompanyFormComponent } from "@app/company-form/company-form.component";
import { CompanyFormComponent as CompanyFormReactiveComponent } from "@app/company-form-reactive/company-form.component";
import { PageLeaveGuard } from '@services';
import { SettingsComponent } from '@app/settings-component/settings.component';


/** Main application routes */
export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'company'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(m => m.AboutComponent),
    title: 'About'
  },
  {
    path: 'company',
    component: CompanyFormComponent,
    title: 'Company',
    canDeactivate: [PageLeaveGuard],
  },
  {
    path: 'company-reactive',
    component: CompanyFormReactiveComponent,
    title: 'Company (Reactive)'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings'
  },
  {
    path: 'test-address',
    component: AddressFormComponent,
    title: 'Test Address'
  },
];
