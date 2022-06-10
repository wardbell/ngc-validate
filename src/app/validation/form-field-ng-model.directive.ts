import { Directive, Inject, Input, OnInit, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

import { FormValidationDirective } from './form-validation.directive'
import { Indexable } from '@core';
import { ModelValidators, MODEL_ASYNC_VALIDATORS, MODEL_VALIDATORS } from './interfaces';
import { ValidationContext, ValidationContextService } from './validation-context.service';
import { vestAsyncFieldValidator, vestSyncFieldValidator } from './validation-fns';

@Directive({
  selector: '[ngModel]',
  standalone: true,
})
export class FormFieldNgModelDirective implements OnInit {
  @Input('group') validationGroup: string | undefined;
  @Input('model') validationModel: Indexable | undefined;
  @Input('modelType') validationModelType: string | undefined;
  @Input() field: string | null = null;

  private context: ValidationContext
  constructor(
    @Optional() private formValidation: FormValidationDirective,
    contextService: ValidationContextService,
    @Optional() @Inject(MODEL_ASYNC_VALIDATORS) private modelAsyncValidators: ModelValidators,
    @Optional() @Inject(MODEL_VALIDATORS) private modelValidators: ModelValidators,
    private ngModel: NgModel,
  ) {
    this.context = contextService.context;
    // console.log('ngModel', ngModel);
    // console.log('ngModel.control.validator', this.ngModel.control.validator);
  }

  ngOnInit(): void {
    const field = this.field || this.ngModel.name;
    const group = this.validationGroup || this.formValidation?.validationGroup;
    const model = this.validationModel || this.formValidation?.validationModel;
    const modelType = this.validationModelType || this.formValidation?.validationModelType;

    if (!modelType || !field) {
      return;
    }

    const suite = this.modelValidators[modelType];
    if (!!suite) {
      const validator = vestSyncFieldValidator(field, suite, model, this.context);
      this.ngModel.control.clearValidators();
      this.ngModel.control.addValidators(validator);
    }

    const asyncSuite = this.modelAsyncValidators[modelType];
    if (!!asyncSuite) {
      const validator = vestAsyncFieldValidator(field, asyncSuite, model, this.context);
      this.ngModel.control.clearAsyncValidators();
      this.ngModel.control.addAsyncValidators(validator);
    }
  }
}
