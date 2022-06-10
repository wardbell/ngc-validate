import { InjectionToken } from '@angular/core';
import { Indexable } from '@utils';
import { Suite } from 'vest';

export const MODEL_ASYNC_VALIDATORS = new InjectionToken('Model Async Validators');
export const MODEL_VALIDATORS = new InjectionToken('Model Validators');

export interface ModelValidators extends Indexable<ValidationSuite> {
}

/** Vest validation suite as constructed in this app. */
export type ValidationSuite = Suite<(model: Indexable, vc?: ValidationContext, field?: string | undefined) => void>;

/** Extra context for use by validators.
 * For example, it could contain a cache of other entities to reference.
 */
export interface ValidationContext extends Indexable {
}
