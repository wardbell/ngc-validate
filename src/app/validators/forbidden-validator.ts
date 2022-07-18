import { Directive, Input } from '@angular/core';
import { AbstractControl,  NG_VALIDATORS, Validator,  ValidationErrors, ValidatorFn } from '@angular/forms';

// Example custom validator
// Borrowed from https://angular.io/guide/form-validation#defining-custom-validators

/** A name can't match the given regular expression */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: `${control.value} is forbidden`} : null;
  };
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[forbiddenName]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input() forbiddenName!: string;

  validate(control: AbstractControl): ValidationErrors | null {
    this.forbiddenName = this.forbiddenName || '^bob$'; // 'bob' is forbidden by default
    return this.forbiddenName
      ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
      : null;
  }
}
