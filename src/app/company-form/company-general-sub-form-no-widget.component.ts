import { Component, Input } from '@angular/core';

import { Company } from '@model';
import { formContainerViewProvider } from '@core';
import { FORMS } from '@imports';

@Component({
  selector: 'app-company-general-sub-form',
  standalone: true,
  imports: [FORMS],
  viewProviders: [formContainerViewProvider],

  template: `
    <div *ngIf="vm" class="row">
      <mat-form-field class="col full-width">
        <input matInput placeholder="Legal Name" name="legalName" [(ngModel)]="vm.legalName" #input="ngModel">
        <mat-error *ngIf="input.errors" class="full-width">
          {{ input.errors['error'] }}
        </mat-error>
      </mat-form-field>
    </div>
  `,
})
export class CompanyGeneralFormComponent {
  @Input() vm?: Partial<Company>;
}
