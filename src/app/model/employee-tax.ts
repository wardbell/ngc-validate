export interface EmployeeTax {
  readonly id: string;
  readonly companyId: string;

  /** Id of the Employee this tax belongs to */
  readonly employeeId: string;

  // #region Set at creation by the tax service

  /** The unique identifier of the tax code. ex: FE0000-003  */
  readonly taxCode: string;

  /** The tax code name, mainly used for display reasons */
  readonly name: string;

  /** The state code. ex PA; null for federal taxes */
  readonly state: string | null;

  /** A code that describes if the tax is on the Federal, State, County, City or School district level */
  readonly taxType: TaxType;

  // #endregion Set at creation by the tax service

  /** Single, Married, Head of Household.  An api driven field. Ex: Married = M */
  filingStatus?: FilingStatus;

  /** If the employee is exempt from paying this tax */
  isExempt: boolean;

  /** Federal or State withholding allowance (a number) */
  withholdingAllowance: number;

  /** Fixed amount of extra withholding (dollars) */
  extraWithholding?: number;
}

/** Filing Status enum */
export enum FilingStatus {
  Single = 'S',
  Married = 'M',
  HeadOfHousehold = 'H'
}

/** Name/Value pairs for the filing status. The name is a label. */
export const FilingStatuses = [
  { name: 'Single or married filing as single', value: 'S' },
  { name: 'Married', value: 'M' },
  { name: 'Head of household', value: 'H' }
]

/** TaxType enum: Federal, State, County, City or School district level  */
export enum TaxType {
  Federal = 'FD',
  State = 'ST',
  County = 'CN',
  City = 'CT',
  SchoolDistrict = 'SD'
}
