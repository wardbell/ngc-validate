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



