import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddressSubFormComponent } from './address-sub-form-reactive/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

import { Address, Company } from '@model';
import { CompanyFormValidationDemo } from '@app/company-form/company-form-validation-demo';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS]
})
export class CompanyFormComponent {

  constructor(private demoService: CompanyFormValidationDemo) { }

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

  /** DEMO: validate the company form and display aspects of it in the browser console */
  showValidationState(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();
    this.demoService.demoReactive(ngForm);
  }
}
