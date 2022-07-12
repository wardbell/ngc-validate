import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { Address, UsStates } from '@model';
import { addressSyncValidationSuite } from '@validators';
import { addValidatorsToControls } from '@validation';

@Component({
  selector: 'app-address-form',
  standalone: true,
  templateUrl: './address-form.component.html',
  imports: [
    CommonModule,
    MatButtonModule, MatCardModule, MatInputModule, MatRadioModule, MatSelectModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent {
  addressForm = this.fb.group({
    street: null,
    street2: null,
    city: null,
    state: null,
    postalCode: null,
  });

  hasStreet2 = false;

  states = UsStates;

  constructor(private fb: FormBuilder) {
    addValidatorsToControls(this.addressForm.controls, addressSyncValidationSuite);
  }

  /** DEMO: validate the address reactive form and display aspects of it in the browser console */
  showValidationState(): void {
    console.groupCollapsed('Address Reactive Form Validation State');
    addressSyncValidationSuite.reset();
    const r = addressSyncValidationSuite(this.addressForm.value as unknown as Address);
    console.log('address form validation state', r);
    const errors = r.getErrors();
    console.log('errors', errors);
    console.groupEnd();
    const errorCount = Object.keys(errors).length;
    alert(`Has ${errorCount ? errorCount : 'no'} errors. Look at browser console.`);
  }
}
