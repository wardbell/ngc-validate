import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { AddressFormComponent } from '../address-form-reactive-w-val/address-form.component';
import { FormValidationDirective, FormFieldNgModelDirective } from '@app/validation';
import { STANDARD } from '@imports';

interface Vm {
  legalName: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>Company</h1>
    <form [model]="vm" modelType="company">
      <mat-form-field class="full-width">
        <input matInput placeholder="Legal Name" name="legalName" [(ngModel)]="vm.legalName" required #input="ngModel">
        <mat-error *ngIf="input.errors">
          {{ input.errors['error'] }}
        </mat-error>
      </mat-form-field>
    </form>

    <app-address-form></app-address-form>
  `,
  imports: [AddressFormComponent, FormFieldNgModelDirective, FormValidationDirective, MatInputModule, STANDARD]
})
export class HomeComponent {
  vm: Vm = {
    legalName: ''
  }
}
