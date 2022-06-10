/** Typescript declarations for custom vest validation rules
 * https://vestjs.dev/docs/enforce/creating_custom_rules
*/
declare global {
  namespace n4s {
    interface EnforceCustomMatchers<R> {
      // Don't mention the first, `value` arg
      isEmail(options?: any): R;
      isPostalCode(locale: string): R;
    }
  }
}

export {};
