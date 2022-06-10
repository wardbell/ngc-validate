import { create, enforce, test, only } from 'vest';

import { Company } from '@model';
import { ValidationContext } from '@app/validation';

export const companyValidatorSuite = create(companyValidators);

function companyValidators(model: Partial<Company>, _context?: ValidationContext, field?: string) {

  only(field);
  if (model) {
    test('legalName', 'Legal Name is required', () => {
      enforce(model.legalName).isNotBlank();
    });

    test('legalName', 'Legal Name must be at least 3 characters long', () => {
      enforce(model.legalName).longerThanOrEquals(3);
    });

    test('legalName', 'Legal Name may be at most 30 characters long', () => {
      enforce(model.legalName).shorterThanOrEquals(30);
    });

  }
}
