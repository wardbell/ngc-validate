import { Indexable } from '@utils';

declare module '@angular/forms' {
  /** Extend features of the Angular AbstractControl class. */
  interface AbstractControl {
    /** Metadata about the validation added by FormFieldNgModelDirective. For unit testing. */
    _validationMetadata?: { field: string, modelType: string };
  }
}
