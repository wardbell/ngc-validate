import { create, group, only, test } from 'vest';

import { AppValidationContext } from './app-validation-context';
import { Company } from '@model';
import { FeinValidationResponse, isGoodFein } from '@services/fein-validation.service';
import { ValidationContext, ValidationSuite, ValidationSuiteFn } from '@app/validation';

export const companyAsyncValidatorSuite: ValidationSuite =
  create((model: Partial<Company>, field?: string, groupName?: string, context?: ValidationContext) => {
    only(field);
    group('company', () => companyAsyncValidators(model, field, groupName, context));
  });


/** Company Asynchronous Validation Suite */
export const companyAsyncValidators: ValidationSuiteFn =
  (model: Partial<Company>, field?: string, groupName?: string, context?: ValidationContext) => {
  const fvs = (<AppValidationContext>context)?.feinValidationService;
  /** FEIN check function (or FN returning "not found" result) */
  const checkFein = fvs
    ? fvs.check.bind(fvs)
    // No fvs? This is almost certainly a bug. Remember to provide a context.
    : (fein: string) => Promise.resolve<FeinValidationResponse>({ fein });


  test('legalName', 'Legal Name must match Federal Tax Name', async () => {
    if (isGoodFein(model.fein) && model.legalName) {
      const response = await checkFein(model.fein!);
      console.log('legal name checkFein response', response);
      const name = response.feinName;
      if (name && name !== '*' && name !== model.legalName.toUpperCase()) {
        throw `Does not match "${name}", the name registered with the IRS for this tax number`;
      }
    }
    return ''; // All other cases are either OK or the test does not apply
  });


  test('fein','Tax Number is not registered with the IRS', async () => {
    if (isGoodFein(model.fein)) {
      const response = await checkFein(model.fein!);
      console.log('fein checkFein response', response);
      if (response.feinName == null) {
        throw 'Tax Number is not registered with the IRS';
      }
    }
    return ''; // All other cases are either OK or the test does not apply
  });
}
