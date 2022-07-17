import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { InputErrorComponent, InputSelectComponent, InputTextComponent } from '@app/widgets';
import { FormFieldNgModelDirective } from '@validation/form-field-ng-model.directive';
import { FormValidationScopeDirective } from '@app/validation/form-validation-scope.directive';

/** Imports for components referencing just the Common Module */
export const COMMON = [CommonModule];

/** Standard imports for (almost) every Template-Driven forms component in this app. */
export const FORMS = [
  CommonModule,
  FormFieldNgModelDirective, FormValidationScopeDirective,
  InputErrorComponent, InputSelectComponent, InputTextComponent,
  MatButtonModule, MatCardModule, MatInputModule, MatRadioModule, MatSelectModule,
  FormsModule,
];
/** Standard imports for (almost) every Reactive Forms component in this app. */
export const REACTIVE_FORMS = [
  CommonModule,
  MatButtonModule, MatCardModule, MatInputModule, MatRadioModule, MatSelectModule,
  ReactiveFormsModule
];

/** Imports for components referencing the Angular Router */
export const ROUTER = [RouterModule];
