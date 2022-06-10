import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule  } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule  } from '@angular/material/select';

import { COMMON, STANDARD } from '@imports';
import { UsStates } from '@model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  templateUrl: './address-form.component.html',
  imports: [
    MatButtonModule, MatCardModule, MatInputModule, MatRadioModule, MatSelectModule, ReactiveFormsModule, COMMON
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

  onSubmit(): void {
    alert('Thanks!');
  }
}
