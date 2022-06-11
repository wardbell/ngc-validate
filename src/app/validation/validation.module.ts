import { NgModule } from '@angular/core';
import { FormFieldNgModelDirective } from './form-field-ng-model.directive';
import { FormValidationModelDirective } from './form-validation-model.directive';

/** Directives for Validation in Template Driven Forms with NgModel.
 * Import in NgModules and standalone components
 */
@NgModule({
  declarations: [FormFieldNgModelDirective, FormValidationModelDirective],
  exports: [FormFieldNgModelDirective, FormValidationModelDirective]
})
export class ValidationModule { }
