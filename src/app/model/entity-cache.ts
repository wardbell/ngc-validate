import { Company } from './company';
import { Employee } from './employee';
import { EmployeeTax } from './employee-tax';

export class Cache {
  currentCompanyId: string = '';
  company?: Company;
  employees: Employee[] = [];
  employeeTaxes: EmployeeTax[] = [];
  loading = false;
}
