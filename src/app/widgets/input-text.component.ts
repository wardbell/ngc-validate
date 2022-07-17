import { Component, ElementRef, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { formContainerViewProvider } from '@core';
import { FormFieldNgModelDirective } from '@validation/form-field-ng-model.directive';
import { FormValidationScopeDirective } from '@validation';
import { InputBaseComponent } from './input-base.component';
import { InputErrorComponent } from './input-error.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'input-text',
  standalone: true,
  imports: [CommonModule, FormFieldNgModelDirective, FormsModule, InputErrorComponent, MatInputModule],
  viewProviders: [formContainerViewProvider],

  template: `
  <mat-form-field [ngClass]="className">
    <mat-label *ngIf="label">{{label}}</mat-label>
    <input matInput
      [disabled]="disabled"
      [field]="field"
      [model]="model" [modelType]="modelType" [group]="group"
      [name]="name!"
      [(ngModel)]="value"
      [ngModelOptions]="ngModelOptions!"
      [placeholder]="placeholder!"
      [type]="type"
      (keyup.esc)="escaped()"
      (blur)="onBlur()"
      #input #ngModel="ngModel">
  </mat-form-field>
  <input-error [control]="ngModel.control"></input-error>
  `,
})
export class InputTextComponent extends InputBaseComponent {
  constructor(
    @Optional() formValidationScope: FormValidationScopeDirective,
    hostElRef: ElementRef
  ) {
    super(formValidationScope, hostElRef)
  }

  protected onBlur() {
    this.trimControlValue();
  }

  /** Trim the value in the ngModel control, which updates the screen and the value of the field in the parent form. */
  private trimControlValue() {
    if (this.ngModel?.control.value !== this.value) {
      this.ngModel?.control.setValue(this.value, { emitEvent: false });
    }
  }
}
