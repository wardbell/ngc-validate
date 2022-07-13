import { Component, Input } from '@angular/core';

import { Address } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';
import { UsStates } from '@model';

@Component({
  selector: 'app-address-sub-form',
  standalone: true,
  templateUrl: './address-sub-form.component.html',
  viewProviders: [formContainerViewProvider],
  imports: [FORMS],
})
export class AddressSubFormComponent {
  @Input() vm?: Address

  /** Name for the formGroup when added to the parent form. Defaults to 'address'. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('name') ngModelGroupName = 'address';

  states = UsStates;
}
