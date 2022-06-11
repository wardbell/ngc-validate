import { Directive, Inject, Input, OnInit, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

import { FormValidationDirective } from './form-validation.directive'
import { Indexable } from '@core';
import { ModelValidators, MODEL_ASYNC_VALIDATORS, MODEL_VALIDATORS } from './interfaces';
import { ValidationContext, VALIDATION_CONTEXT } from './validation-context';
import { vestAsyncFieldValidator, vestSyncFieldValidator } from './validation-fns';

@Directive({
  selector: '[ngModel]',
  standalone: true,
})
export class FormFieldNgModelDirective implements OnInit {
  @Input() context: ValidationContext | undefined;
  @Input() field: string | undefined;
  @Input() group: string | undefined;
  @Input() model: Indexable | undefined;
  @Input() modelType: string | undefined;

  constructor(
    @Optional() private formValidation: FormValidationDirective,
    @Optional() @Inject(VALIDATION_CONTEXT) private globalContext: ValidationContext,
    @Optional() @Inject(MODEL_ASYNC_VALIDATORS) private modelAsyncValidators: ModelValidators,
    @Optional() @Inject(MODEL_VALIDATORS) private modelValidators: ModelValidators,
    private ngModel: NgModel,
  ) {
    // console.log('ngModel', ngModel);
    // console.log('ngModel.control.validator', this.ngModel.control.validator);
  }

  ngOnInit(): void {
    // Blend explicit context (if provided) with global context
    const context = { ...this.globalContext, ...(this.context || this.formValidation?.context) };
    const field = this.field || this.ngModel.name;
    const group = this.group || this.formValidation?.group;
    const model = this.model || this.formValidation?.model;
    const modelType = this.modelType || this.formValidation?.modelType;

    if (!field || !modelType) {
      return; // Must have a minimum of the field and modelType to add a validator
    }

    const suite = this.modelValidators[modelType];
    if (!!suite) {
      const validator = vestSyncFieldValidator(suite, field, model, group, context);
      this.ngModel.control.clearValidators();
      this.ngModel.control.addValidators(validator);
    }

    const asyncSuite = this.modelAsyncValidators[modelType];
    if (!!asyncSuite) {
      const validator = vestAsyncFieldValidator(suite, field, model, group, context);
      this.ngModel.control.clearAsyncValidators();
      this.ngModel.control.addAsyncValidators(validator);
    }
  }
}
