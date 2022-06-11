import { Component, Input } from '@angular/core';

import { Company } from '@model';
import { formViewProvider } from '@core';
import { FORMS } from '@imports';

interface Vm extends Company { }

@Component({
  selector: 'app-company-general-sub-form',
  standalone: true,
  template: `
    <div class="row">
      <div class="col">
        <mat-form-field class="full-width">
          <input matInput placeholder="Legal Name" name="legalName" [(ngModel)]="vm!.legalName" required
            #input="ngModel">
          <mat-error *ngIf="input.errors">
            {{ input.errors['error'] }}
          </mat-error>
        </mat-form-field>
      </div>
    </div>
  `,
  styleUrls: ['./company-form.component.scss'],
  viewProviders: [formViewProvider],
  imports: [FORMS]
})
export class CompanyGeneralFormComponent {
  @Input() vm: Vm | undefined;
}
