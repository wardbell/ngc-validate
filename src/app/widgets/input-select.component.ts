import { Component, ElementRef, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { formContainerViewProvider } from '@core';
import { FormFieldNgModelDirective } from '@validation/form-field-ng-model.directive';
import { FormValidationScopeDirective } from '@validation';
import { InputBaseComponent } from './input-base.component';
import { InputErrorComponent } from './input-error.component';
import { SelectOption } from './interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'input-select',
  standalone: true,
  imports: [CommonModule, FormsModule, InputErrorComponent, MatInputModule, FormFieldNgModelDirective],
  viewProviders: [formContainerViewProvider],

  template: `
  <mat-form-field [ngClass]="className">
    <mat-label *ngIf="label">{{label}}</mat-label>
    <select matNativeControl
      [disabled]="disabled"
      [field]="field"
      [model]="model" [modelType]="modelType" [group]="group"
      [name]="name!"
      [(ngModel)]="value"
      [ngModelOptions]="ngModelOptions!"
      (keyup.esc)="escaped()"
      #input #ngModel="ngModel">
        <option *ngIf="showPlaceholderOption" [value]="value" disabled>
          {{ placeholderOption }}
        </option>
        <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">
          {{ option.name }}
        </option>
    </select>
  </mat-form-field>
  <input-error [control]="ngModel.control"></input-error>
  `,
})
export class InputSelectComponent extends InputBaseComponent  {
  @Input() options: SelectOption[] = [];

  /** Display this text as the (disabled) first option when the model.field is "empty". */
  @Input() placeholderOption = '';

  constructor(
    @Optional() formValidationScope: FormValidationScopeDirective,
    hostElRef: ElementRef
  ) {
    super(formValidationScope, hostElRef);
  }

  get showPlaceholderOption() {
    return this.placeholderOption && (this.value === '' || this.value == null);
  }
}
