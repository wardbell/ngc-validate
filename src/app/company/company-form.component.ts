import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';

// // With widgets
import { AddressFormComponent } from '@app/address/address-form.component';
import { CompanyGeneralFormComponent } from './company-general-form.component';

// No widgets
// import { AddressFormComponent } from './address-form-no-widget/address-form.component';
// import { CompanyGeneralFormComponent } from './company-general-form-no-widget.component';

import { Company } from '@model';
import { CompanyFormValidationDemoService } from '@services/company-form-validation-demo.service';
import { CompanyViewService } from './company-view.service';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  imports: [AddressFormComponent, CompanyGeneralFormComponent, FORMS],
})
export class CompanyFormComponent {
  /** The NgForm, exposed for testing only. */
  @ViewChild('form') form!: NgForm;

  constructor(
    private viewService: CompanyViewService,
    private demoService: CompanyFormValidationDemoService,
  ) { }

  vm!: Company;
  vm$ = this.viewService.company$.pipe(
    tap(vm => this.vm = vm!) // access the view model from within the class
  );

  canLeave() {
    return this.viewService.saveCompanyVm(this.vm);
  }

  /** DEMO: validate the company form and display aspects of it in the browser console */
  showValidationState(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();
    this.demoService.demoTD(ngForm.controls, this.vm!);
  }
}
