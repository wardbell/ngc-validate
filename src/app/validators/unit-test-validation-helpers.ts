import { SuiteRunResult } from 'vest';
type FailureMessages = Record<string, string[]>;

import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

import { AppValidationContext } from './app-validation-context';
import { FeinValidationService, FeinValidationResponse, isGoodFein } from '@services';
import { UsStates } from '@model';

export const disabledState = UsStates.find(s => s.disabled === false);
export const supportedState = UsStates.find(s => s.name === 'California');

// TO MAKE TYPESCRIPT HAPPY, MUST ALSO REGISTER EACH CUSTOM MATCHER WITH unit-test-validation-matcher-types.d.ts
/** Jasmine custom matchers that simplify vest validation testing. */
export const customVestSuiteResultMatchers: CustomMatcherFactories = {
  /** The validation result should have the expected error - determined by the RegExp - for the given field.
   * If there is no RegExp, then passes if the field has any error.
  */
  hasExpectedFieldError: function (_util: MatchersUtil): CustomMatcher {
    return {
      compare: function hasExpectedFieldError(actual: SuiteRunResult, field: string, errRegExp?: RegExp): CustomMatcherResult {
        const errors = actual.getErrors()[field];
        let message: string | undefined;
        if (errors) {
          if (errRegExp && !errors.some(e => errRegExp.test(e))) {
            message = `Expected one of the "${field}" errors to match ${errRegExp}; got ${JSON.stringify(errors)}`;
          }
        } else {
          message = `Expected errors for field "${field}" but got none`;
        }
        const pass = message == null;
        return {
          pass,
          message: pass ? `has expected error for "${field}"` : message
        };
      }
    }
  },

  /** The validation result should NOT have any errors for the given field. */
  hasNoFieldErrors: function (_util: MatchersUtil): CustomMatcher {
    return {
      compare: function (actual: SuiteRunResult, field: string): CustomMatcherResult {
        const errors = actual.getErrors()[field];
        let message: string | undefined;
        if (errors) {
          message = `Expected no errors for field "${field}" but got ${JSON.stringify(errors)}`;
        }
        const pass = message == null;
        // Result and message generation.
        return {
          pass,
          message: pass ? `"${field}" has no errors` : message
        };
      }
    }
  }
};

export class FakeFeinValidationService {
  /** Check if an FEIN/Legal Name combination is valid
   * @returns Promise of the faked service response.
   */
   check(fein: string): Promise<FeinValidationResponse> {
    if (!isGoodFein(fein)) {
      return Promise.reject(`Bad FEIN "${fein}"`);
    }

    const lead = fein.substring(0, 2); // mock response based on lead 2 digits.
    if (fein === '13-1234567') {
      return Promise.resolve({ fein, feinName: 'MARVELOUS PRODUCTS, INC.'});
    } else if (lead === '22') {
      return Promise.resolve({ fein, feinName: '*' }); // Always OK
    } else {
      return Promise.resolve({ fein }); // Always BAD
    }
  }
}

export const testAppContext: AppValidationContext = {
  feinValidationService: new FakeFeinValidationService() as FeinValidationService,
}
