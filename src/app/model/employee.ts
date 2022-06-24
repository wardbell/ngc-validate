import { Address } from './address';

export interface Employee extends Address {
  // Personal Address fields come from Address base interface
  id: string;
  companyId: string;

  birthDate: string;
  email: string;
  employeeStatus: EmployeeStatus;
  employeeType: EmployeeType;
  hireDate: string;
  name: string;
}

export enum EmployeeStatus {
  Active = 'Active',
  Terminated = 'Terminated',
}

export enum EmployeeType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contractor = '1099 Contractor'
}
