import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddressSubFormComponent } from './address-sub-form-reactive/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

import { Address, Company } from '@model';
import { companyValidatorSuite } from '@app/validators';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
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

  onSave(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();

    // Extract raw control values
    // TODO: save the changes
    const controlValues = ngForm.value;

    // DEMO TIME!
    console.log('ngForm.controls', ngForm.controls);
    const r = companyValidatorSuite(controlValues);
    const errors = r.getErrors();
    console.log('company form vest validation state', r);
    console.log('vest validation errors', errors);

    const errorCount = Object.keys(errors).length;
    alert(`Saved! Has ${errorCount ? errorCount : 'no' } errors. Look at browser console.`);
  }
}
