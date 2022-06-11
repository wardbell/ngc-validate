import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddressSubFormComponent } from '@app/address-sub-form/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

import { Company } from '@model';
import { companyValidatorSuite } from '@app/validators';
import { FORMS } from '@imports';

interface Vm extends Company { }

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS]
})
export class CompanyFormComponent {

  vm: Vm = {
    id: '',
    legalName: '',
    workAddress: {
      street: null,
      street2: null,
      city: null,
      state: null,
      postalCode: null,
    }
  }

  onSave(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();

    console.log('ngForm.controls', ngForm.controls);

    const r = companyValidatorSuite(this.vm);
    console.log('company form vest validation state', r);

    console.log('vest validation errors', r.getErrors());

    alert('Saved! Look at browser console.');
  }
}
