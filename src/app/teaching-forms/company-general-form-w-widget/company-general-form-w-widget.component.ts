import { Component, Input } from '@angular/core';

import { Company } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-general-form',
  standalone: true,
  imports: [FORMS],
  templateUrl: './company-general-form-w-widget.component.html',
  viewProviders: [formContainerViewProvider],
})
export class CompanyGeneralFormComponent {
  @Input() vm?: Partial<Company>;
}
