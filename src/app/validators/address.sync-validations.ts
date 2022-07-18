import { create, enforce, only, test } from 'vest';

import { Address, UsStates } from '@model';
import { ValidationContext, ValidationSuite, ValidationSuiteFn } from '@validation';

export const addressSyncValidationSuite: ValidationSuite =
  create('AddressSyncValidationSuite',
    (model: Partial<Address>, field?: string, groupName?: string, context?: ValidationContext) => {
    only(field); // if field defined, limit to tests of this field
    addressSyncValidations(model, field, groupName, context);
  });

export const addressSyncValidations: ValidationSuiteFn = (model: Partial<Address>) => {
  test('street', 'Street is required', () => {
    enforce(model.street).isNotBlank();
  });

  test('street', 'Street must be at least 3 characters long', () => {
    enforce(model.street).longerThanOrEquals(3);
  });

  test('street', 'Street may be at most 50 characters long', () => {
    enforce(model.street).shorterThanOrEquals(50);
  });

  test('city', 'City is required', () => {
    enforce(model.city).isNotBlank();
  });

  test('state', 'State is required', () => {
    enforce(model.state).isNotBlank();
  });

  test('state', 'State must be one of the supported US states', () => {
    enforce(model.state).condition((state: string) =>
      UsStates.some(s => s.abbreviation === state && !s.disabled));
  });

  test('postalCode', 'Postal Code is required', () => {
    enforce(model.postalCode).isNotBlank();
  });

  test('postalCode', 'Postal Code must be 5 digit zip (12345) or a zip+4 (12345-1234)', () => {
    enforce(model.postalCode).isPostalCode('US');
  });
}
