import { InjectionToken } from '@angular/core';
import { Indexable } from '@utils';
import { Suite } from 'vest';

export const ASYNC_VALIDATION_SUITE_FACTORIES = new InjectionToken('Async Validation Suite Factories');
export const SYNC_VALIDATION_SUITES = new InjectionToken('Synchronous Validation Suites');

export interface AsyncValidationSuiteFactories extends Indexable<() => ValidationSuite> {
}

export interface SyncValidationSuites extends Indexable<ValidationSuite> {
}

/** Vest validation suite as constructed in this app. */
export type ValidationSuite = Suite<ValidationSuiteFn>;

/** Vest validation suite function. Pass to vest `create()` to make a vest suite. */
export type ValidationSuiteFn = (
  model: Indexable,
  field?: string,
  group?: string,
  vc?: ValidationContext
) => void;

/** Extra context for use by validators.
 * For example, it could contain a cache of other entities to reference.
 */
export interface ValidationContext extends Indexable {
}
