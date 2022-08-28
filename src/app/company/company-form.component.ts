import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

// // With widgets
import { AddressFormComponent } from '@app/address/address-form.component';
import { CompanyGeneralFormComponent } from './company-general-form.component';

// No widgets
// import { AddressFormComponent } from './address-form-no-widget/address-form.component';
// import { CompanyGeneralFormComponent } from './company-general-form-no-widget.component';

import { areDifferent, deepClone } from '@utils';
import { Company } from '@model';
import { CompanyFormValidationDemoService } from '@services/company-form-validation-demo.service';
import { DataService } from '@services';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  templateUrl: './company-form.component.html',
  imports: [AddressFormComponent, CompanyGeneralFormComponent, FORMS],
})
export class CompanyFormComponent implements OnInit {
  /** The NgForm, exposed for testing only. */
  @ViewChild('form') form!: NgForm;

  constructor(
    private dataService: DataService,
    private demoService: CompanyFormValidationDemoService,
  ) { }

  vm?: Partial<Company>;

  canLeave() {
    return this.save();
  }

  ngOnInit(): void {
    this.dataService.company$.pipe(
      filter(co => co != null),
      take(1)
    ).subscribe(co => this.vm = deepClone(co));
  }

  /** Save company changes if there are any. */
  private save() {
    const { company } = this.dataService.cacheNow();
    const newCo = { ...company, ...this.vm } as Company;
    if (areDifferent(company, this.vm)) {
      return this.dataService.saveCompanyData({ company: newCo });
    } else {
      return true; // no change
    }
  }

  /** DEMO: validate the company form and display aspects of it in the browser console */
  showValidationState(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();
    this.demoService.demoTD(ngForm.controls, this.vm!);
  }
}
