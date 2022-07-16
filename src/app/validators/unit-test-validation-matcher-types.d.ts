// import { SuiteRunResult } from 'vest';

declare namespace jasmine {
  interface Matchers<T> {
    /** The validation result should have the expected error - determined by the RegExp - for the given field.
     * If there is no RegExp, then passes if the field has any error.
     */
    hasExpectedFieldError(field: string, errRegExp?: RegExp, expectationFailOutput?: any): boolean;
    /** The validation result should NOT have any errors for the given field. */
    hasNoFieldErrors(field: string, expectationFailOutput?: any): boolean;
  }
}
