import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddressReactiveFormComponent } from './address-form-reactive.component';
import { CompanyGeneralReactiveFormComponent } from './company-general-form-reactive.component';

import { Address, Company } from '@model';
import { CompanyFormValidationDemoService } from '@services/company-form-validation-demo.service';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form-reactive.component.html',
  imports: [AddressReactiveFormComponent, CompanyGeneralReactiveFormComponent, FORMS]
})
export class CompanyReactiveFormComponent {

  constructor(private demoService: CompanyFormValidationDemoService) { }

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
