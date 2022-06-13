import { Directive, Inject, Input, OnInit, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

import { FormValidationModelDirective } from './form-validation-model.directive'
import { Indexable } from '@core';
import { ModelValidators, MODEL_ASYNC_VALIDATORS, MODEL_VALIDATORS } from './interfaces';
import { ValidationContext, VALIDATION_CONTEXT } from './validation-context';
import { vestAsyncFieldValidator, vestSyncFieldValidator } from './validation-fns';

/** Sets validators for Template-Driven controls using NgModel
 * Skipped if element with `[ngModel]` also has `no-val` attribute
*/
@Directive({
  selector: '[ngModel]:not([no-val])',
})
export class FormFieldNgModelDirective implements OnInit {

  /** Context that validators may reference for external information.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Blended with global ValidationContext (if it exists).
   * Optional.
   */
  @Input() context?: ValidationContext;

  /** Field (property) of the model to validate.
   * If not specified, will use the NgModel name.
   */
  @Input() field?: string;

  /** Group of tests within the validation suite. Only process tests in that group.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Optional.
   */
  @Input() group?: string;

  /** Data model whose properties will be validated.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Required for validation.
   */
  @Input() model?: Indexable;

  /** Name of the type of model to be validated. Identifies the suite of validators to apply.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Required for validation.
   */
  @Input() modelType?: string;

  constructor(
    @Optional() private formValidation: FormValidationModelDirective,
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
