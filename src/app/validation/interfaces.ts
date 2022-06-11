import { InjectionToken } from '@angular/core';
import { Indexable } from '@utils';
import { Suite } from 'vest';

export const MODEL_ASYNC_VALIDATORS = new InjectionToken('Model Async Validators');
export const MODEL_VALIDATORS = new InjectionToken('Model Validators');

export interface ModelValidators extends Indexable<ValidationSuite> {
}

/** Vest validation suite as constructed in this app. */
export type ValidationSuite = Suite<ValidationSuiteFn>;

/** Vest validation suite function. Pass to vest `create()` to make a vest suite. */
export type ValidationSuiteFn = (
  model: Indexable,
  field?: string | undefined,
  group?: string | undefined,
  vc?: ValidationContext | undefined
) => void;

/** Extra context for use by validators.
 * For example, it could contain a cache of other entities to reference.
 */
export interface ValidationContext extends Indexable {
}
