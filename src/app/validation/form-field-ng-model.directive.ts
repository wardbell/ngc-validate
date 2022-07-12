import { Directive, Inject, Input, OnChanges, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

import { FormValidationModelDirective } from './form-validation-model.directive'
import { Indexable } from '@core';
import {
  AsyncValidationSuiteFactories, ASYNC_VALIDATION_SUITE_FACTORIES,
  SYNC_VALIDATION_SUITES, SyncValidationSuites
} from './interfaces';
import { ValidationContext, VALIDATION_CONTEXT } from './validation-context';
import { vestAsyncFieldValidator, vestSyncFieldValidator } from './validation-fns';

/** Sets validators for Template-Driven controls using NgModel
 * Skipped if element with `[ngModel]` also has `no-val` attribute
*/
@Directive({
  selector: '[ngModel]:not([no-val])',
  standalone: true,
})
export class FormFieldNgModelDirective implements OnChanges {

  /** Context that validators may reference for external information.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Blended with global ValidationContext (if it exists).
   * Optional.
   */
  @Input() context?: ValidationContext;

  /** Field (property) of the model to validate.
   * If not specified, will use the NgModel control's name (value of the `name` attribute).
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
    @Optional() @Inject(ASYNC_VALIDATION_SUITE_FACTORIES) private asyncValidationSuiteFactories: AsyncValidationSuiteFactories,
    @Optional() @Inject(SYNC_VALIDATION_SUITES) private syncValidationSuites: SyncValidationSuites,
    /** Form control for the ngModel directive */
    private ngModel: NgModel,
  ) {
    // console.log('ngModel', ngModel);
    // console.log('ngModel.control.validator', this.ngModel.control.validator);
  }

  ngOnChanges(): void {
    // Blend explicit context (if provided) with global context
    const context = { ...this.globalContext, ...(this.context || this.formValidation?.context) };
    const field = this.field || this.ngModel.name;
    const group = this.group || this.formValidation?.group;
    const model = this.model ?? this.formValidation?.model;
    const modelType = this.modelType || this.formValidation?.modelType;

    if (!field || !modelType) {
      return; // Must have a minimum of the field and modelType to add a validator
    }

    const suite = this.syncValidationSuites[modelType];
    if (!!suite) {
      const validator = vestSyncFieldValidator(suite, field, model, group, context);
      this.ngModel.control.clearValidators();
      this.ngModel.control.addValidators(validator);
    }

    /* Async suite factory creates a vest suite of async validations for the given model type
     *
     * Each async validator needs its own instance of the async vest suite.
     * You can only call `done()` once per suite invocation.
     * If you call `done()` twice while an async operation is flight,
     * that operation's resolution will not be caught by the later `done()`.
     * So we need to isolate suite instances.
     */
    const asyncSuiteFactory = this.asyncValidationSuiteFactories[modelType];
    if (!!asyncSuiteFactory) {
      const asyncSuite = asyncSuiteFactory();
      const validator = vestAsyncFieldValidator(asyncSuite, field, model, group, context);
      this.ngModel.control.clearAsyncValidators();
      this.ngModel.control.addAsyncValidators(validator);
    }
  }
}
