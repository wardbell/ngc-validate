import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/** Imports for components referencing just the Common Module */
export const COMMON = [CommonModule];

/** Imports for components referencing the Angular Router */
export const ROUTER = [RouterModule];

/** Standard imports for (almost) every standalone component in this app. */
export const STANDARD = [CommonModule, FormsModule, ReactiveFormsModule];
