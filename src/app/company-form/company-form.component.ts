import { Component, OnInit } from '@angular/core';
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
  template: `
    <form *ngIf="vm" #form="ngForm" [model]="vm" modelType="company">
      <mat-card class="company-card">

        <mat-card-header class="my-header">
          <mat-card-title>Company (Template Driven)</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <app-company-general-sub-form [vm]="vm"></app-company-general-sub-form>
          <app-address-sub-form [vm]="vm.workAddress" name="workAddress"></app-address-sub-form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" type="button" (click)="showValidationState(form)">Show Validation State</button>
        </mat-card-actions>

      </mat-card>
    </form>
  `,
  styleUrls: ['./company-form.component.scss'],
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS]
})
export class CompanyFormComponent implements OnInit {
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
    if (areDifferent(company, this.vm)) {
      return this.dataService.saveCompanyData({company: this.vm as Company});
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
