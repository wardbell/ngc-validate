import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddressSubFormComponent } from './address-sub-form-reactive/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

import { Address, Company } from '@model';
import { companySyncValidationSuite } from '@validators';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS]
})
export class CompanyFormComponent {

  company: Company = {
    id: '',
    legalName: '',
    workAddress: {
      street: '',
      street2: '',
      city: '',
      state: '',
      postalCode: ''
    } as Address
  };

  /** DEMO: validate the company form VM and display aspects of it in the browser console */
  showValidationState(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();

    console.groupCollapsed('Company Form Control State');
    console.log('ngForm.controls', ngForm.controls);

    companySyncValidationSuite.reset();
    // Pass raw control values directly to the validation suite
    const syncResult = companySyncValidationSuite(ngForm.value);
    const syncErrors = syncResult.getErrors();
    console.log('company form vest synchronous validation state', syncResult);
    console.log('vest synchronous validation errors', syncErrors);
    console.groupEnd();
    const errorCount = Object.keys(syncErrors).length;
    alert(`Has ${errorCount ? errorCount : 'no'} errors. Look at browser console.`);
  }
}
