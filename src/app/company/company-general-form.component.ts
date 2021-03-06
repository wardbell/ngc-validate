import { Component, Input, ViewChild } from '@angular/core';

import { Company } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';
import { InputTextComponent } from '@app/widgets';

@Component({
  selector: 'app-company-general-form',
  standalone: true,
  imports: [FORMS],
  templateUrl: './company-general-form.component.html',
  viewProviders: [formContainerViewProvider],
})
export class CompanyGeneralFormComponent {
  @Input() vm?: Partial<Company>;
  @ViewChild('legalName') legalNameComponent!: InputTextComponent;

  /** Revalidate LegalName, updating its error message, when FEIN changes.
  * A change to FEIN should invalidate the Legal Name if that name does not match the registered IRS name.
  *
  * Problem: Angular won't automatically revalidate one field when another changes.
  * A model group level validation won't help; can't use that to control the legal name message output
  *
  * Solution: when FEIN changes, force revalidation of Legal Name
  */
  protected feinChanged(_fein: string | null) {
    // console.log('fein changed to ' + _fein);
    const control = this.legalNameComponent.control;
    control?.markAsTouched(); // ensure display
    setTimeout(() => {
      // wait one tick for ngModel to update the model, then re-validate.
      control?.updateValueAndValidity();
    });
  }
}
