import { create, enforce, group, only, test } from 'vest';

import { addressValidators } from './address.validator';
import { Company } from '@model';
import { ValidationContext, ValidationSuite, ValidationSuiteFn } from '@app/validation';

export const companyValidatorSuite: ValidationSuite =
  create((model: Partial<Company>, field?: string, groupName?: string, context?: ValidationContext) => {
    only(field);
    group('company', () => companyValidators(model, field, groupName, context));
    group('workAddress', () => addressValidators(model.workAddress!, field, groupName, context));
  });

export const companyValidators: ValidationSuiteFn = (model: Partial<Company>) => {
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
