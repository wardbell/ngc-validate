import { Component, Input } from '@angular/core';

import { Address } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';
import { UsStates } from '@model';

@Component({
  selector: 'app-address-sub-form',
  standalone: true,
  templateUrl: './address-sub-form.component.html',
  styleUrls: ['./address-sub-form.component.scss'],
  viewProviders: [formContainerViewProvider],
  imports: [FORMS],
})
export class AddressSubFormComponent {
  @Input() vm: Address | undefined;

  /** Name for the formGroup when added to the parent form. Defaults to 'address'. */
  @Input('name') ngModelGroupName = 'address';

  hasStreet2 = false;

  states = UsStates;
}
