import { Company, Employee, EmployeeTax } from '@model';

/** Mock database */
export class Db {
  Company: Company[] = [];
  Employee: Employee[] = [];
  EmployeeTax: EmployeeTax[] = [];
}
