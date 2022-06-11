import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { Address, UsStates } from '@model';
import { addValidatorsToControls } from '@app/validation';
import { addressValidatorSuite } from '@app/validators';

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
    addValidatorsToControls(this.addressForm.controls, addressValidatorSuite);
  }

  onSubmit(): void {
    alert('Saved! Look at browser console.');
    const r = addressValidatorSuite(this.addressForm.value as unknown as Address);
    console.log('address form validation state', r);

    console.log('errors', r.getErrors());
  }
}
