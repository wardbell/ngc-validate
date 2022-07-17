import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

// // With widgets
import { AddressSubFormComponent } from './address-sub-form/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

// No widgets
// import { AddressSubFormComponent } from './address-sub-form-no-widget/address-sub-form.component';
// import { CompanyGeneralFormComponent } from './company-general-sub-form-no-widget.component';

import { areDifferent, deepClone } from '@utils';
import { Company } from '@model';
import { CompanyFormValidationDemo } from './company-form-validation-demo';
import { DataService } from '@services';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS],

  template: `
    <form *ngIf="vm" #form="ngForm" [model]="vm" modelType="company">
      <mat-card>

        <mat-card-header>
          <mat-card-title>Company</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <app-company-general-sub-form [vm]="vm"></app-company-general-sub-form>

          <h2>Work Address</h2>

          <app-address-sub-form [vm]="vm?.workAddress" name="workAddress"></app-address-sub-form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" type="button" (click)="showValidationState(form)">Show Validation State</button>
        </mat-card-actions>

      </mat-card>
    </form>
  `,
})
export class CompanyFormComponent implements OnInit {
  /** The NgForm, exposed for testing only. */
  @ViewChild('form') form!: NgForm;

  constructor(
    private dataService: DataService,
    private demoService: CompanyFormValidationDemo,
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

  showValidationState(ngForm: NgForm): void {
    // DEMO TIME! Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();
    console.log('ngForm.controls', ngForm.controls);
    this.demoService.demo(this.vm!);
  }
}
