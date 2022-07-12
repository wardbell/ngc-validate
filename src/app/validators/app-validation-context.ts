import { inject } from '@angular/core';

import { FeinValidationService } from '@services';

import { ValidationContext } from '@validation/interfaces';

export interface AppValidationContext extends ValidationContext {
  feinValidationService: FeinValidationService
}

export function appValidationContextFactory(): AppValidationContext {
  const feinValidationService = inject(FeinValidationService);
  return {
    feinValidationService
  };
}
