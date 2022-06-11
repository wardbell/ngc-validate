import { InjectionToken } from '@angular/core';

import { ValidationContext } from './interfaces';
export { ValidationContext };

export const VALIDATION_CONTEXT = new InjectionToken<ValidationContext>('ValidationContext');
