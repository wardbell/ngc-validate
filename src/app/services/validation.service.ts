import { Injectable, Inject } from '@angular/core';

import { AppValidationContext } from '@validators/app-validation-context';
import { VALIDATION_CONTEXT } from '@validation/validation-context';

@Injectable({ providedIn: 'root' })
export class ValidationService {

  constructor(@Inject(VALIDATION_CONTEXT) private appValidationContext: AppValidationContext) {
  }
}
