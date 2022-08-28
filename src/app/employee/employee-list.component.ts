import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeViewService } from './employee-view.service';
import { LIST } from '@imports';

@Component({
  selector: 'app-ee-list',
  standalone: true,
  template: `
  <form *ngIf="employees$ | async as employees">
  <mat-card>

    <mat-card-header>
      <mat-card-title>Employees</mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <table *ngIf="employees?.length !== 0; else noEes">
        <tr *ngFor="let ee of employees">
          <td [routerLink]="['/employees/' + ee.id]">{{ ee.name }}</td>
        </tr>
      </table>
      <ng-template #noEes>
        No Employees in this company
      </ng-template>
    </mat-card-content>

  </mat-card>
</form>

  `,
  imports: [LIST, RouterModule],
})
export class EmployeeListComponent {
  constructor( private viewService: EmployeeViewService) { }

  employees$ = this.viewService.employees$;
}
