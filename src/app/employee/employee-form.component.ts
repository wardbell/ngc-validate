import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';

import { AddressFormComponent } from '@app/address/address-form.component';
import { areDifferent, deepClone } from '@utils';
import { Employee, EmployeeType} from '@model';
import { DataService } from '@services';
import { FORMS } from '@imports';
import { SelectOption } from '@app/widgets/interfaces';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  template: `
  <a [routerLink]="'/employees'">
    <span class="material-icons">arrow_back</span>
    <span style="vertical-align: top">Employees</span>
  </a>

  <form *ngIf="vm" #form="ngForm" [model]="vm" modelType="employee">
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
export class EmployeeFormComponent implements OnInit {
  /** The NgForm, exposed for testing only. */
  @ViewChild('form') form!: NgForm;

  employeeTypes: SelectOption[] = [
    { name: 'Full Time', value: EmployeeType.FullTime },
    { name: 'Part Time', value: EmployeeType.PartTime },
    { name: '1099 Contractor', value: EmployeeType.Contractor }
  ];
  vm!: Employee;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    const eeId = this.route.snapshot.params['id'];
    const { employees } = this.dataService.cacheNow();
    const ee = employees.find(e => e.id == eeId);
    if (ee) {
      this.vm = deepClone(ee);
    } else {
      this.router.navigateByUrl('/employees');
    }
  }

  canLeave() {
    return !this.vm || this.save();
  }

  /** Save Employee changes if there are any. */
  private save() {
    const eeId = this.vm!.id;
    const { employees: oldEmployees } = this.dataService.cacheNow();
    const oldEe = oldEmployees.find(e => e.id === eeId);
    if (areDifferent(oldEe, this.vm)) {
      const employees = oldEmployees.map(e => e.id === eeId ? {...this.vm} : e );
      return this.dataService.saveCompanyData({ employees });
    } else {
      return true; // no change
    }
  }
}
