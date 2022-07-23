import { Provider } from '@angular/core';

import { addressSyncValidationSuite } from './address.sync-validations';
import { companySyncValidationSuite } from './company.sync-validations';
import { createCompanyAsyncValidationSuite } from './company.async-validations';

import { extendVest } from './vest-enforce-extension';
extendVest();

import { Indexable } from '@utils';
import { ASYNC_VALIDATION_SUITE_FACTORIES, SYNC_VALIDATION_SUITES, ValidationSuite } from '@validation';

/** Synchronous Vest Validation Suites for this app, keyed by model type. */
export const syncValidationSuites: Indexable<ValidationSuite> = {
  address: addressSyncValidationSuite,
  company: companySyncValidationSuite,
};

/** Creators of Asynchronous Vest Validation Suites for this app, keyed by model type.
 * @see `form-field-ng-model-directive.ts`
*/
export const asyncValidationSuiteFactories: Indexable<() => ValidationSuite> = {
  company: createCompanyAsyncValidationSuite,
};

/** Providers for the application-specific sync and async validation suite maps. */
export const validationSuiteProviders: Provider[] = [
  { provide: ASYNC_VALIDATION_SUITE_FACTORIES, useValue: asyncValidationSuiteFactories },
  { provide: SYNC_VALIDATION_SUITES, useValue: syncValidationSuites },
];
