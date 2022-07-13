import { InjectionToken } from '@angular/core';

import { ValidationContext } from './interfaces';
export { ValidationContext };

/** Injection token for the global validation context. The app can implement and provide with this token. */
export const VALIDATION_CONTEXT = new InjectionToken<ValidationContext>('ValidationContext');
