import { create, enforce, test, only } from 'vest';

import { Address, UsStates } from '@model';
import { ValidationContext } from '@app/validation';

export const addressValidatorSuite = create(addressValidators);

function addressValidators(model: Partial<Address>, _context?: ValidationContext, field?: string) {

  only(field);
  if (model) {
    test('street', 'Street is required', () => {
      enforce(model.street).isNotBlank();
    });

    test('street', 'Street must be at least 3 characters long', () => {
      enforce(model.street).longerThan(2);
    });

    test('city', 'City is required', () => {
      enforce(model.city).isNotBlank();
    });

    test('state', 'State is required', () => {
      enforce(model.state).isNotBlank();
    });

    test('state', 'State must be one of the US states', () => {
      enforce(model.state).condition((state: string) =>
        UsStates.some(s => s.abbreviation === state));
    });

    test('postalCode', 'Postal Code is required', () => {
      enforce(model.postalCode).isNotBlank();
    });

    test('postalCode', 'Postal Code must be 5 digit zip (12345) or a zip+4 (12345-1234)', () => {
      enforce(model.postalCode).isPostalCode('US');
    });
  }
}
