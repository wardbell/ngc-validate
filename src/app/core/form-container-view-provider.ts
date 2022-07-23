import { Optional, Provider } from '@angular/core';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';

/**
 * Provide a ControlContainer to a form component from the
 * nearest parent NgModelGroup (preferred) or NgForm.
 *
 * Required for Reactive Forms as well (unless you write CVA)
 *
 * @example
 * ```
 *   @Component({
 *     ...
 *    viewProviders[ formContainerViewProvider ]
 *   })
 * ```
 * @see Kara's AngularConnect 2017 talk: https://youtu.be/CD_t3m2WMM8?t=1826
 *
 * Without this provider
 * - Controls are not registered with parent NgForm or NgModelGroup
 * - Form-level flags say "untouched" and "valid"
 * - No form-level validation roll-up
 * - Controls still validate, update model, and update their statuses
 * - If within NgForm, no compiler error because ControlContainer is optional for ngModel
 *
 * Note: if the Form Component that uses this Provider
 * is not within a Form or NgModelGroup, the provider returns `null`
 * resulting in an error, something like
 * ```
 * preview-fef3604083950c709c52b.js:1 ERROR Error:
 *  ngModelGroup cannot be used with a parent formGroup directive.
 *```
 */
export const formContainerViewProvider: Provider = {
  provide: ControlContainer,
  useFactory: formContainerViewProviderFactory,
  deps: [
    [new Optional(), NgForm],
    [new Optional(), NgModelGroup]
  ]
};

export function formContainerViewProviderFactory(
  ngForm: NgForm, ngModelGroup: NgModelGroup
) {
  return ngModelGroup ?? ngForm ?? null;
}
