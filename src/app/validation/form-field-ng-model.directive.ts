import { Directive, Inject, Input, OnChanges, OnDestroy, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FormValidationScopeDirective } from './form-validation-scope.directive'
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
export class FormFieldNgModelDirective implements OnChanges, OnDestroy {

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
   */
  @Input() group?: string;

  /** Data model whose properties will be validated.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   */
  @Input() model?: Indexable;

  /** Name of the type of model to be validated. Identifies the suite of validators to apply.
   * If not specified, try to pick up from parent FormValidationModelDirective.
   * Required for validation.
   */
  @Input() modelType?: string;

  private scopeSub?: Subscription;

  constructor(
    @Optional() private formValidationScope: FormValidationScopeDirective,
    @Optional() @Inject(ASYNC_VALIDATION_SUITE_FACTORIES) private asyncValidationSuiteFactories: AsyncValidationSuiteFactories,
    @Optional() @Inject(SYNC_VALIDATION_SUITES) private syncValidationSuites: SyncValidationSuites,
    @Optional() @Inject(VALIDATION_CONTEXT) private globalContext: ValidationContext,
    /** Form control for the ngModel directive */
    private ngModel: NgModel,
  ) {
    if (formValidationScope) {
      // (re)setup validation if the validation scope was updated.
      this.scopeSub = this.formValidationScope.changed.subscribe(_ => this.ngOnChanges());
    }
  }

  ngOnChanges(): void {
    if (!this.syncValidationSuites || !this.asyncValidationSuiteFactories) {
      throw 'FormFieldNgModelDirective: cannot validate because there are no registered validation suites.';
    }

    const ngModelControl = this.ngModel.control;

    const field = this.field || this.ngModel.name; // if no field name, assume the name of the control is the field name.
    const modelType = this.modelType || this.formValidationScope?.modelType;

    const model = this.model ?? this.formValidationScope?.model;

    if (!field || !model || !modelType) {
      // Must have the field, model, and modelType to add a validator.
      ngModelControl._validationMetadata = undefined; // NOT adding validators
      return;
    }

    // Blend contexts with more local context (ex: this.context) taking precedence.
    const context = { ...this.globalContext, ...this.formValidationScope?.context, ...this.context };
    const group = this.group || this.formValidationScope?.group;
    ngModelControl._validationMetadata = { field, modelType };

    const suite = this.syncValidationSuites[modelType];
    if (!!suite) {
      const validator = vestSyncFieldValidator(suite, field, model, group, context);
      ngModelControl.clearValidators();
      ngModelControl.addValidators(validator);
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
      ngModelControl.clearAsyncValidators();
      ngModelControl.addAsyncValidators(validator);
    }

    ngModelControl.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.scopeSub?.unsubscribe();
  }
}
