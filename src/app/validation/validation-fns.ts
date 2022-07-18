import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { Indexable } from '@utils';
import { ValidationContext, ValidationSuite } from './interfaces';

/** Create Angular synchronous validator function for a single field of the model in the validation context.
 * When validation fails, the function returns a validation errors with two properties:
 * `error` - the first vest validation error,
 * `errors` - all of the vest validation errors for that field.
 * @param suite the vest suite with validation rules
 * @param field to validate
 * @param [model] the model data to validate or a function returning such a model
 * Merges the control.value as the field property of that model.
 * @param [group] the name of a group of tests; only process tests in this group.
 * @param [context] global contextual data passed to vest validation rules.
 */
export function vestSyncFieldValidator(
  suite: ValidationSuite,
  field: string,
  model?: Indexable | (() => Indexable),
  group?: string,
  context?: ValidationContext,
): ValidatorFn | ValidatorFn[] {
  const vestValidator = (control: AbstractControl): ValidationErrors | null => {
    // Note: must merge control.value because ngModel will not have updated the viewModel yet.
    const mod: Indexable = { ...(typeof model == 'function' ? model() : model), [field]: control.value };
    const result = suite(mod, field, group, context).getErrors();
    const errors = result[field];
    return errors ? { error: errors[0], errors } : null;
  };

  // HACK to find out if the field is required.
  // Angular Material  looks for an Angular required validator and draws the component label accordingly.
  // So if we discover that the field is required, "compose" with that Angular required validator
  const testRun = suite({ [field]: null }, field, group, context).getErrors();
  const isRequired = (testRun[field] ?? []).some(err => err.includes('is required'));
  return isRequired ? [vestValidator, Validators.required] : vestValidator;
}

/** Create Angular asynchronous validator function for a single field of the model in the validation context
 * When validation fails, the function returns a validation errors with two properties:
 * `error` - the first vest validation error,
 * `errors` - all of the vest validation errors for that field.
 * @param suite that creates the vest suite with async validation rules.
 * @param field to validate
 * @param [model] the model data to validate or a function returning such a model
 * Merges the control.value as the field property of that model.
 * @param [group] the name of a group of tests; only process tests in this group.
 * @param [context] global contextual data passed to vest validation rules.
 *
 * The must be a unique instance!
 *
 * Each async validator needs its own instance of the async vest suite.
 * You can only call `done()` once per suite invocation.
 * If you call `done()` twice while an async operation is flight,
 * that operation's resolution will not be caught by the later `done()`.
 * So we need to isolate suite instances.
 */
export function vestAsyncFieldValidator(
  suite: ValidationSuite,
  field: string,
  model?: Indexable | (() => Indexable),
  group?: string,
  context?: ValidationContext,
): AsyncValidatorFn {
  // console.log(`*** Creating vestAsyncValidator for field ${field}`)
  const vestAsyncValidator = (control: AbstractControl): Promise<ValidationErrors | null> => {
    const promise = new Promise<ValidationErrors | null>((resolve) => {
      // console.log(`async validator for ${field} started`);
      // Note: must merge control.value because ngModel will not have updated the viewModel yet.
      const mod: Indexable = { ...(typeof model == 'function' ? model() : model), [field]: control.value };
      suite(mod, field, group, context)
        .done(field, result => {
          // console.log(`async validator for ${field} resolved`);
          const errors = result.getErrors()[field];
          resolve(errors ? { error: errors[0], errors } : null);
        })
        // Catch case where the field has no async validations
        .done(_result => {
          // All validations complete. Resolve w/o error.
          // Harmless if field DID have async validation and resolved earlier
          // because this second call to `resolve` would do nothing.
          // But if the field did NOT have an async validation,
          // the earlier field resolve would not have been called and
          // the field status would be "PENDING" forever.
          // Example: comment out all async validations for "legalName".
          resolve(null);
        });
    })
    return promise;
  };
  return vestAsyncValidator;
}
