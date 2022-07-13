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
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngModel]:not([no-val])',
  standalone: true,
})
export class FormFieldNgModelDirective implements OnChanges {

  /** Context that validators may reference for external information and services.
   * Blended with global ValidationContext and parent FormValidationModelDirective context.
   * Optional.
   */
  @Input() context?: ValidationContext;

  /** Field name to validate. Should be a property of the model.
   * If not specified, will use the NgModel control's name (value of the `name` attribute).
   */
  @Input() field?: string;

  /** Group name of tests within the validation suite.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * If there is a group name, only process tests in that group.
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
    @Optional() @Inject(ASYNC_VALIDATION_SUITE_FACTORIES) private asyncValidationSuiteFactories: AsyncValidationSuiteFactories,
    @Optional() @Inject(SYNC_VALIDATION_SUITES) private syncValidationSuites: SyncValidationSuites,
    @Optional() @Inject(VALIDATION_CONTEXT) private globalContext: ValidationContext,
    /** Form control for the ngModel directive */
    private ngModel: NgModel,
  ) { }

  ngOnChanges(): void {
    const field = this.field || this.ngModel.name; // if no field name, assume the name of the control is the field name.
    const modelType = this.modelType || this.formValidation?.modelType;

    if (!field || !modelType) {
      return; // Must have a minimum of the field and modelType to add a validator
    }

    // Blend contexts with more local context (ex: this.context) taking precedence.
    const context = { ...this.globalContext, ...this.formValidation?.context, ...this.context };
    const group = this.group || this.formValidation?.group;
    const model = this.model ?? this.formValidation?.model;

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
