import { FormControl } from '@angular/forms';

import { Indexable } from '@utils';
import { AsyncValidationSuiteFactory, ValidationContext, ValidationSuite } from './interfaces';
import { vestAsyncFieldValidator, vestSyncFieldValidator} from './validation-fns'

/** Create and add Angular Validators to all the given form controls.
 * Useful primarily in Reactive Forms.
 * @param controlGroup an object whose properties are the field names and values are FormControls.
 * ex: an Angular `FormGroup`. Note can only be one level deep and not include FormArrays.
 * @param syncSuite the vest suite with synchronous validation rules
 * @param [asyncSuiteFactory] optional creator of vest suite with asynchronous validation rules
 * @param [model] the model data to validate or a function returning such a model
 * @param [context] global contextual data passed to vest validation rules.
 * @param [group] the name of a group of tests; only process tests in this group.
 */
export function addValidatorsToControls(
  controlGroup: Indexable<FormControl>,
  syncSuite: ValidationSuite,
  asyncSuiteFactory?: AsyncValidationSuiteFactory,
  model?: Indexable,
  context?: ValidationContext,
  group?: string,
) {
  Object.entries(controlGroup).forEach(([field, control]) => {
    const validator = vestSyncFieldValidator(syncSuite, field, model, group, context);
    control.clearValidators(); // start over
    control.addValidators(validator);

    if (asyncSuiteFactory) {
      const asyncSuite = asyncSuiteFactory();
      const validator = vestAsyncFieldValidator(asyncSuite, field, model, group, context);
      control.clearAsyncValidators(); // start over
      control.addAsyncValidators(validator);
    }
  });
}

