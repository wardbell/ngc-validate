import { InjectionToken } from '@angular/core';
import { Indexable } from '@utils';
import { Suite } from 'vest';

export const ASYNC_VALIDATION_SUITE_FACTORIES = new InjectionToken('Async Validation Suite Factories');
export const SYNC_VALIDATION_SUITES = new InjectionToken('Synchronous Validation Suites');

/** Map of asynchronous vest validation suite factories (creators), keyed by model type. */
export interface AsyncValidationSuiteFactories extends Indexable<() => ValidationSuite> {
}

/** Map of synchronous vest validation suites, keyed by model type. */
export interface SyncValidationSuites extends Indexable<ValidationSuite> {
}

/** A vest sync or async validation suite, shaped for this validation implementation. */
export type ValidationSuite = Suite<ValidationSuiteFn>;

/** Vest validation suite function. Pass to vest `create()` to make a vest suite. */
export type ValidationSuiteFn = (
  model: Indexable,
  field?: string,
  group?: string,
  vc?: ValidationContext
) => void;

/** Global context with properties and services for use by validations.
 * For example, it could contain a cache of other entities to reference.
 * Each application can/should implement as needed and inject with the VALIDATION_CONTEXT injection token
 */
export interface ValidationContext extends Indexable {
}
