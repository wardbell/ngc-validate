import { inject, Provider} from '@angular/core';

import { FeinValidationService } from '@services';
import { ValidationContext, VALIDATION_CONTEXT } from '@validation';

/** Global context for use by validations in this application.
 * Provided in `main.ts` with VALIDATION_CONTEXT injection token.
 */
export interface AppValidationContext extends ValidationContext {
  feinValidationService: FeinValidationService
}

/** Provider of the global context for use by validations in this application. Provide in `main.ts`.*/
export const appValidationContextProvider: Provider = { provide: VALIDATION_CONTEXT, useFactory: () => {
  const feinValidationService = inject(FeinValidationService);
  return {
    feinValidationService
  } as AppValidationContext;
}};


// #region Extend vest.enforce with external validation rules from the validator.js library
// https://vestjs.dev/docs/enforce/consuming_external_rules
// Must be part of a file that will be included in all compilations
// This file is as good as any.
import { enforce } from 'vest';
import isEmail from 'validator/es/lib/isEmail';
import isPostalCode from 'validator/es/lib/isPostalCode';

enforce.extend({ isEmail, isPostalCode });
// #endregion Extend vest.enforce with external validation rules from the validator.js library

