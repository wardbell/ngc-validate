import { Component, Input } from '@angular/core';

import { Company } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-general-sub-form',
  standalone: true,
  imports: [FORMS],
  viewProviders: [formContainerViewProvider],

  template: `
    <div class="row">
      <input-text name="legalName" placeholder="Legal Name"></input-text>
    </div>
  `,
})
export class CompanyGeneralFormComponent{
  @Input() vm?: Partial<Company>;
}
