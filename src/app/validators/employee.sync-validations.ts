import { create, enforce, group, only, test } from 'vest';

import { addressSyncValidations } from './address.sync-validations';
import { Employee, EmployeeType } from '@model';
import { ValidationContext, ValidationSuite, ValidationSuiteFn } from '@validation';

const employeeTypes = [EmployeeType.Contractor, EmployeeType.FullTime, EmployeeType.PartTime];


/** Employee Synchronous Validation Suite */
export const employeeSyncValidationSuite: ValidationSuite =
  create('EmployeeSyncValidationSuite',
    (model: Partial<Employee>, field?: string, groupName?: string, context?: ValidationContext) => {
    only(field); // if field defined, limit to tests of this field
    only.group(groupName); // if groupName defined, limit to tests of this group
    group('employee', () => employeeSyncValidations(model, field, groupName, context));
    group('homeAddress', () => addressSyncValidations(model, field, groupName, context));
  });

/** Employee Synchronous Validations, written in vest. */
export const employeeSyncValidations: ValidationSuiteFn = (model: Partial<Employee>) => {
  model = model ?? {};

  test('name', 'Employee name is required', () => {
    enforce(model.name).isNotBlank();
  });

  test('employeeType', 'Employee Type is required', () => {
    enforce(model.employeeType).isNotBlank();
  });

  test('employeeType', `Employee Type must be ${employeeTypes.join(' or ')}`, () => {
    enforce(model.employeeType).condition(type => employeeTypes.includes(type));
  });

}
