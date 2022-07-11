import { Injectable, Inject } from '@angular/core';

import { AppValidationContext } from '@app/validators/app-validation-context';
import { Company } from '@model';
import { companyValidatorSuite, companyAsyncValidatorSuite } from '@app/validators';
import { VALIDATION_CONTEXT } from '@app/validation/validation-context';

@Injectable({providedIn: 'root'})
export class ValidationService {

  constructor(@Inject(VALIDATION_CONTEXT) private appValidationContext: AppValidationContext) {
  }
}
