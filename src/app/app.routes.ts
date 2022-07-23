import { Routes } from '@angular/router';
import { SoloAddressFormComponent } from '@app/teaching-forms/solo-address-form-reactive-w-val/solo-address-form.component';
import { CompanyFormComponent } from "@app/company/company-form.component";
import { CompanyReactiveFormComponent } from "@app/company-reactive/company-form-reactive.component";
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
      import('@app/teaching-forms/about/about.component').then(m => m.AboutComponent),
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
    component: CompanyReactiveFormComponent,
    title: 'Company (Reactive)'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings'
  },
  {
    path: 'solo-address',
    component: SoloAddressFormComponent,
    title: 'Solo Address'
  },
];
