import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { Indexable } from '@utils';
import { ValidationContext, ValidationSuite } from './interfaces';

// #region Extend vest.enforce with external validation rules from the validator.js library
// https://vestjs.dev/docs/enforce/consuming_external_rules
import { enforce } from 'vest';
import isEmail from 'validator/es/lib/isEmail';
import isPostalCode from 'validator/es/lib/isPostalCode';

enforce.extend({ isEmail, isPostalCode });
// #endregion Extend vest.enforce with external validation rules from the validator.js library

/** Create and add Angular sync Validators to all the given form controls
 * @param controlGroup an object whose properties are the field names and values are FormControls.
 * ex: an Angular `FormGroup`. Note can only be one level deep and not include FormArrays.
 * @param suite the vest suite with validation rules
 * @param [model] the model data to validate. If missing, create one with the field and control.value
 * @param [context] global contextual data passed to vest validation rules.
 */
 export function addValidatorsToControls(
  controlGroup: Indexable<FormControl>,
  suite: ValidationSuite,
  model?: Indexable,
  context?: ValidationContext,
) {
  Object.entries(controlGroup).forEach(([field, control]) => {
    const validator = vestSyncFieldValidator(field, suite, model, context);
    control.clearValidators(); // start over
    control.addValidators(validator);
  })
}

/** Create Angular sync Validator functions for each of the given fields
 * NOT USED?
 * @param fields to validate
 * @param suite the vest suite with validation rules
 * @param [model] the model data to validate. If missing, create one with the field and control.value
 * @param [context] global contextual data passed to vest validation rules.
 */
export function makeValidatorsForModel(
  fields: string[],
  suite: ValidationSuite,
  model?: Indexable,
  context?: ValidationContext,
) {
  return (fields || []).reduce((acc, field) => {
    const fn = vestSyncFieldValidator(field, suite, model, context);
    acc[field] = fn;
    return acc;
  }, {} as Indexable);
}

/** Create synchronous validator of a single field of the model in the validation context
 * @param field to validate
 * @param suite the vest suite with validation rules
 * @param [model] the model data to validate. If missing, create one with the field and control.value
 * @param [context] global contextual data passed to vest validation rules.
*/
export function vestSyncFieldValidator(
  field: string,
  suite: ValidationSuite,
  model?: Indexable,
  context?: ValidationContext,
): ValidatorFn | ValidatorFn[] {
  const validator = (control: AbstractControl): ValidationErrors | null => {
    const result = suite({ ...model, [field]: control.value }, context, field).getErrors();
    const errors = result[field];
    // Only report the first error.
    return errors ? { error: errors[0] } : null;
  };

  // HACK to find out if the field is required.
  // Angular Material  looks for an Angular required validator and draws the component label accordingly.
  // So if we discover that the field is required, "compose" with that Angular required validator
  const testRun = suite({ [field]: null }, context, field).getErrors();
  const isRequired = (testRun[field] || []).some(err => err.includes('is required'));
  return isRequired ? [validator, Validators.required] : validator;
}

/** Create asynchronous validator of a single field of the model in the validation context
 * @param field to validate
 * @param suite the vest suite with async validation rules
 * @param [model] the model data to validate. If missing, create one with the field and control.value
 * @param [context] global contextual data passed to vest validation rules.
*/
export function vestAsyncFieldValidator(
  field: string,
  suite: ValidationSuite,
  model?: Indexable,
  context?: ValidationContext,
): AsyncValidatorFn {
  const validator = (control: AbstractControl): Promise<ValidationErrors | null> => {
    const promise = new Promise<ValidationErrors | null>((resolve) => {
      suite({ ...model, [field]: control.value }, context, field).done(field, result => {
        const errors = result.getErrors();
        // Only report the first error.
        resolve(errors ? { error: errors[0] } : null);
      });
    })
    return promise;
  };
  return validator;
}
