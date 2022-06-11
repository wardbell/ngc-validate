import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';

import { Address } from '@model';
import { addValidatorsToControls } from '@app/validation';
import { addressValidatorSuite } from '@app/validators';
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
  selector: 'app-address-sub-form',
  standalone: true,
  templateUrl: './address-sub-form.component.html',
  styleUrls: ['./address-sub-form.component.scss'],
  imports: [REACTIVE_FORMS],
})
export class AddressSubFormComponent implements OnInit {
  /** Name for the formGroup when added to the parent form. Defaults to 'address'. */
  @Input('name') formGroupName = 'address';

  @Input() address: Address | undefined;

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
    addValidatorsToControls(this.addressForm.controls, addressValidatorSuite);
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
