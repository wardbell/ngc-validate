import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { UsStates } from '@model';

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
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
  });

  hasAddress2 = false;

  states = UsStates;

  constructor(private fb: FormBuilder) {
  }
  
  /** DEMO: validate the address reactive form and display aspects of it in the browser console */
  showValidationState(): void {
    console.groupCollapsed('Address Reactive Form Validation State');
    this.addressForm.markAllAsTouched();
    console.log('ngForm.controls', this.addressForm.controls);
    const errors = this.addressForm.errors ?? {};
    console.log('errors', errors);
    console.groupEnd();
    const errorCount = Object.keys(errors).length;
    alert(`Has ${errorCount ? errorCount : 'no'} errors. Look at browser console.`);
  }
}
