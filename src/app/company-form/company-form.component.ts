import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

// // With widgets
import { AddressSubFormComponent } from './address-sub-form/address-sub-form.component';
import { CompanyGeneralFormComponent } from './company-general-sub-form.component';

// No widgets
// import { AddressSubFormComponent } from './address-sub-form-no-widget/address-sub-form.component';
// import { CompanyGeneralFormComponent } from './company-general-sub-form-no-widget.component';

import { Address, Company } from '@model';
import { companyValidatorSuite } from '@app/validators';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-form',
  standalone: true,
  template: `
    <form #form="ngForm" [model]="vm" modelType="company">
      <mat-card class="company-card">

        <mat-card-header class="my-header">
          <mat-card-title>Company</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <app-company-general-sub-form [vm]="vm"></app-company-general-sub-form>
          <app-address-sub-form [vm]="vm.workAddress" name="workAddress"></app-address-sub-form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" type="button" (click)="onSave(form)">Save</button>
        </mat-card-actions>

      </mat-card>
    </form>
  `,
  styleUrls: ['./company-form.component.scss'],
  imports: [AddressSubFormComponent, CompanyGeneralFormComponent, FORMS]
})
export class CompanyFormComponent {

  vm: Partial<Company> = { workAddress: { } as Address};

  onSave(ngForm: NgForm): void {
    // Reveal validation state at this form level and all the way down.
    ngForm?.form.markAllAsTouched();

    // TODO: save the changes

    // DEMO TIME!
    console.log('ngForm.controls', ngForm.controls);
    const r = companyValidatorSuite(this.vm);
    const errors = r.getErrors();
    console.log('company form vest validation state', r);
    console.log('vest validation errors', errors);

    const errorCount = Object.keys(errors).length;
    alert(`Saved! Has ${errorCount ? errorCount : 'no' } errors. Look at browser console.`);
  }
}
