import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';

import { addValidatorsToControls, VALIDATION_CONTEXT } from '@validation';
import { AppValidationContext, createCompanyAsyncValidationSuite, companySyncValidationSuite } from '@validators';
import { Company } from '@model';
import { formContainerViewProvider } from '@core';
import { REACTIVE_FORMS } from '@imports';

@Component({
  selector: 'app-company-general-sub-form',
  standalone: true,
  template: `
  <div [formGroup]="generalForm">
    <div class="row">
      <mat-form-field class="col full-width">
        <input matInput placeholder="Legal Name" formControlName="legalName" required>
        <mat-error *ngIf="generalForm.controls.legalName.errors">
          {{ generalForm.controls.legalName.errors['error'] }}
        </mat-error>
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field class="col mid-width">
        <input matInput placeholder="fein" formControlName="fein" required>
        <mat-error *ngIf="generalForm.controls.fein.errors">
          {{ generalForm.controls.fein.errors['error'] }}
        </mat-error>
      </mat-form-field>
    </div>
  </div>
  `,
  viewProviders: [formContainerViewProvider],
  imports: [REACTIVE_FORMS]
})
export class CompanyGeneralFormComponent implements OnInit {
  @Input() company?: Company;

  protected generalForm = this.fb.group({
    legalName: '',
    fein: '',
  });

  constructor(
    @Optional() @Inject(VALIDATION_CONTEXT) validationContext: AppValidationContext,
    private fb: FormBuilder,
    private parent: NgForm
  ) {
    addValidatorsToControls(
      this.generalForm.controls,
      companySyncValidationSuite,
      createCompanyAsyncValidationSuite,
      () => this.generalForm.value,
      validationContext,
    );

    // because change to fein can invalidate legalName ...
    this.generalForm.controls.fein.valueChanges.subscribe(_ =>
      // wait a tick before updating legalName
      setTimeout(() => this.generalForm.controls.legalName.updateValueAndValidity())
    );

  }

  ngOnInit(): void {
    // Add this reactive form to the parent form
    // See Kara's AngularConnect 2017 talk: https://youtu.be/CD_t3m2WMM8?t=2150
    // Wait a tick to bypass ExpressionChangedAfterItHasBeenCheckedError for `ng-valid`
    setTimeout(() => {
      this.parent.form.addControl('general', this.generalForm);
      if (this.company) {
        // Populate controls
        this.generalForm.setValue({
          legalName: this.company.legalName || '',
          fein: this.company.fein || '',
        });
      }
    }, 1);
  }
}
