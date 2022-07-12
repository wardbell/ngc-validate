import { Indexable } from '@utils';
import { ValidationSuite } from '@validation';
import { addressSyncValidationSuite } from './address.sync-validations';
import { companySyncValidationSuite } from './company.sync-validations';
import { createCompanyAsyncValidationSuite } from './company.async-validations';

/** Synchronous Vest Validation Suites for this app, keyed by model type. */
export const syncValidationSuites: Indexable<ValidationSuite> = {
  address: addressSyncValidationSuite,
  company: companySyncValidationSuite,
}

/** Creators of Asynchronous Vest Validation Suites for this app, keyed by model type.
 * @see `form-field-ng-model-directive.ts`
*/
export const asyncValidationSuiteFactories: Indexable<() => ValidationSuite> = {
  company: createCompanyAsyncValidationSuite,
}
