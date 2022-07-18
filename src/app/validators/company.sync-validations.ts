import { create, enforce, group, only, test } from 'vest';

import { addressSyncValidations } from './address.sync-validations';
import { Company } from '@model';
import { isGoodFein } from '@services/fein-validation.service';
import { ValidationContext, ValidationSuite, ValidationSuiteFn } from '@validation';

/** Company Synchronous Validation Suite */
export const companySyncValidationSuite: ValidationSuite =
  create('CompanySyncValidationSuite',
    (model: Partial<Company>, field?: string, groupName?: string, context?: ValidationContext) => {
    only(field); // if field defined, limit to tests of this field
    only.group(groupName); // if groupName defined, limit to tests of this group
    group('company', () => companySyncValidations(model, field, groupName, context));
    group('workAddress', () => addressSyncValidations(model.workAddress!, field, groupName, context));
  });

/** Company Synchronous Validations, written in vest. */
export const companySyncValidations: ValidationSuiteFn = (model: Partial<Company>) => {
  test('legalName', 'Legal Name is required', () => {
    enforce(model.legalName).isNotBlank();
  });

  test('legalName', 'Legal Name must be at least 3 characters long', () => {
    enforce(model.legalName).longerThanOrEquals(3);
  });

  test('legalName', 'Legal Name may be at most 30 characters long', () => {
    enforce(model.legalName).shorterThanOrEquals(30);
  });

  test('fein', 'Tax Number is required', () => {
    enforce(model.fein).isNotBlank();
  });

  test('fein', 'Tax Number format must be 99-9999999', () => {
    enforce(isGoodFein(model.fein)).equals(true);
  });
}
