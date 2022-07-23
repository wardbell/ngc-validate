import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';

import { Address } from '@model';
import { addValidatorsToControls } from '@validation';
import { addressSyncValidationSuite } from '@validators';
import { REACTIVE_FORMS } from '@imports';
import { UsStates } from '@model';

interface Vm {
  street: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  templateUrl: './address-form-reactive.component.html',
  imports: [REACTIVE_FORMS],
})
export class AddressReactiveFormComponent implements OnInit {
  /** Name for the formGroup when added to the parent form. Defaults to 'address'. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('name') formGroupName = 'address';

  @Input() address?: Address;

  protected addressForm = this.fb.group({
    street: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  hasStreet2 = false;

  states = UsStates;

  constructor(private fb: FormBuilder, private parent: NgForm) {
    addValidatorsToControls(this.addressForm.controls, addressSyncValidationSuite);
  }

  ngOnInit(): void {
    // Add this reactive form to the parent form
    // See Kara's AngularConnect 2017 talk: https://youtu.be/CD_t3m2WMM8?t=2150
    // Wait a tick to bypass ExpressionChangedAfterItHasBeenCheckedError for `ng-valid`
    setTimeout(() => {
      this.parent.form.addControl(this.formGroupName, this.addressForm);
      if (this.address) {
        // Populate controls
        this.addressForm.setValue(this.address);
      }
    }, 1);
  }
}
