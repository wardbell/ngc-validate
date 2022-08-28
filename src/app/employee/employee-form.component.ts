import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddressFormComponent } from '@app/address/address-form.component';
import { EmployeeViewService, employeeTypes } from './employee-view.service';
import { FORMS } from '@imports';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  template: `
  <a [routerLink]="'/employees'">
    <span class="material-icons">arrow_back</span>
    <span style="vertical-align: top">Employees</span>
  </a>

  <form *ngIf="vm$ | async as vm" #form="ngForm" [model]="vm" modelType="employee">
    <mat-card>

      <mat-card-header>
        <mat-card-title>{{vm.name || 'The Employee'}}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
      <div class="row">
        <input-text name="name" placeholder="Name"></input-text>
        <input-select name="employeeType" label="Type" [options]="employeeTypes" placeholderOption="Select an employee type ..."></input-select>
      </div>
        <h2>Home Address</h2>
        <app-address-form [vm]="vm" name="homeAddress"></app-address-form>
      </mat-card-content>

    </mat-card>
</form>
  `,
  imports: [AddressFormComponent,  FORMS, RouterModule],
})
export class EmployeeFormComponent {
  constructor(private viewService: EmployeeViewService) { }

  employeeTypes = employeeTypes;
  vm$ = this.viewService.getEmployeeVm();

  /** Save Employee changes, if there are any, when user navigates away. */
  canLeave() {
    return this.viewService.saveEmployeeVm(this.vm$);
  }
}
