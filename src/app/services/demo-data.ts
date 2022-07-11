import { Company, Employee, EmployeeTax, EmployeeStatus, EmployeeType, FilingStatus, TaxType } from '@model';
import { Db } from './db';

interface Example {
  company: Company;
  employees: Employee[];
  employeeTaxes: EmployeeTax[];
}

/** return a newly created data for the demo */
export function createDemoData() {

  const db = new Db();

  addExample(createMarvelous());
  return db;

  /// helpers

  function addExample({ company, employees, employeeTaxes }: Example) {
    db.Company.push(company);
    db.Employee.push(...employees);
    db.EmployeeTax.push(...employeeTaxes);
  }

  function createMarvelous(): Example {

    const companyId = '14869218ca0645cea77d491325216e46';

    const company: Company = {
      id: companyId,
      fein: '13-1234567',
      legalName: 'Marvelous Products',
      workAddress: {
        street: '321 E Chapman Ave',
        street2: null,
        city: 'Fullerton',
        state: 'CA',
        postalCode: '92832',
        verified: true
      }
    }

    const adamId = 'a241473f45e547dab3a90162c1b903d0';
    const bobId = 'b7c591310b5040a688360162c1b903d0';
    const cathyId = 'cbf51450a77942a197f80170e1eabb23';

    const employees: Employee[] = [
      {
        id: adamId,
        companyId,

        street: 'Turnbull Canyon Rd',
        street2: 'Apt 301',
        city: 'Whittier',
        state: 'CA',
        postalCode: '90601',
        verified: true,

        birthDate: '1984-10-18T17:00:00Z',
        email: 'aa@marvelous.com',
        employeeStatus: EmployeeStatus.Active,
        employeeType: EmployeeType.FullTime,
        hireDate: '2005-04-01T17:00:00Z',
        name: 'Adam Adamson'
      },
      {
        id: bobId,
        companyId,

        street: '1951 N Jones Blvd',
        street2: '',
        city: 'Las Vegas',
        state: 'NV',
        postalCode: '89108',
        verified: true,

        birthDate: '1984-10-18T17:00:00Z',
        email: 'bk@marvelous.com',
        employeeStatus: EmployeeStatus.Active,
        employeeType: EmployeeType.FullTime,
        hireDate: '2005-04-01T17:00:00Z',
        name: 'Bob Kazoo'
      },
      {
        id: cathyId,
        companyId,

        street: '2099 N 63rd St',
        street2: '',
        city: 'Philadelphia',
        state: 'PA',
        postalCode: '19151',
        verified: true,

        birthDate: '1984-10-18T17:00:00Z',
        email: 'cs@marvelous.com',
        employeeStatus: EmployeeStatus.Active,
        employeeType: EmployeeType.FullTime,
        hireDate: '2005-04-01T17:00:00Z',
        name: 'Cathy Sing'
      },
    ];

    const employeeTaxes: EmployeeTax[] = [
      // Adam
      {
        id: '3818e5c1eb2649f3a4b40166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYEE',
        state: null,
        taxCode: 'FE0000-003',
        taxType: TaxType.Federal,
      },
      {
        id: '14cd941e1b73414098ad0166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYEE',
        state: null,
        taxCode: 'FE0000-005',
        taxType: TaxType.Federal,
      },
      {
        id: '1987665c80a3400983310166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 3,
        extraWithholding: 0,
        name: 'FEDERAL WITHHOLDING',
        'filingStatus': FilingStatus.Married,
        state: null,
        taxCode: 'FE0000-001',
        taxType: TaxType.Federal,
      },
      {
        id: '2a9cbb15234f43bc89070166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYER',
        state: null,
        taxCode: 'FE0000-004',
        taxType: TaxType.Federal,
      },
      {
        id: 'fe703615ddd34d659ddb0166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYER',
        state: null,
        taxCode: 'FE0000-006',
        taxType: TaxType.Federal,
      },
      {
        id: '211a5786c39249caa4b70166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'FEDERAL UNEMPLOYMENT EMPLOYER',
        state: null,
        taxCode: 'FE0000-010',
        taxType: TaxType.Federal,
      },
      {
        id: '878d645f03444b6b96950166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 4,
        extraWithholding: 0,
        name: 'NEW YORK WITHHOLDING',
        taxCode: 'NY0000-001',
        state: 'NY',
        taxType: TaxType.State,
        'filingStatus': FilingStatus.Single
      },
      {
        id: 'c56354edd3e04233adbe0166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEW YORK STATE UNEMPLOYMENT EMPLOYER',
        state: 'NY',
        taxCode: 'NY0000-010',
        taxType: TaxType.State
      },
      {
        id: '5b791c4fe8ca4e11bd550166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEW YORK REEMPLOYMENT SERVICE EMPLOYER',
        state: 'NY',
        taxCode: 'NY0000-128',
        taxType: TaxType.State
      },
      {
        id: 'a88dc1a8789c4fdfa07d0166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEW YORK MCTMT EMPLOYER',
        state: 'NY',
        taxCode: 'NY0000-145',
        taxType: TaxType.County
      },
      {
        id: '8f1f9a238fe6445da9df0166a12ec8ec',
        companyId,
        employeeId: adamId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEW YORK',
        state: 'NY',
        taxCode: 'NY0061-001',
        taxType: TaxType.City
      },

      // Bob
      {
        id: 'e3f384ff4785415094f80170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYEE',
        state: null,
        taxCode: 'FE0000-003',
        taxType: TaxType.Federal,
      },
      {
        id: 'ad6bf542f6fb438aa0ae0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYEE',
        state: null,
        taxCode: 'FE0000-005',
        taxType: TaxType.Federal,
      },
      {
        id: '468d2eb45eb94b1eb0220170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'FEDERAL WITHHOLDING',
        state: null,
        taxCode: 'FE0000-001',
        taxType: TaxType.Federal,
        'filingStatus': FilingStatus.HeadOfHousehold,
      },
      {
        id: 'bf231870c7cb4908a08b0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYER',
        state: null,
        taxCode: 'FE0000-004',
        taxType: TaxType.Federal,
      },
      {
        id: '8e9e1b6346bb49e093cd0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYER',
        state: null,
        taxCode: 'FE0000-006',
        taxType: TaxType.Federal,
      },
      {
        id: '82cdc489159741c2a05e0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'FEDERAL UNEMPLOYMENT EMPLOYER',
        state: null,
        taxCode: 'FE0000-010',
        taxType: TaxType.Federal,
      },
      {
        id: '28ae3396535846f1833b0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA STATE UNEMPLOYMENT EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-010',
        taxType: TaxType.State
      },
      {
        id: 'caeeae7f19c74e02b4d30170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA MODIFIED BUSINESS TAX EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-134',
        taxType: TaxType.State
      },
      {
        id: '1ee41b95406a483c9e5e0170b6c49965',
        companyId,
        employeeId: bobId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA CAREER ENHANCEMENT EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-131',
        taxType: TaxType.State
      },

      // Cathy
      {
        id: 'c7ce674ec719417899ca0170e1ed1b78',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYEE',
        state: null,
        taxCode: 'FE0000-003',
        taxType: TaxType.Federal,
      },
      {
        id: '29e7b264b1e34bacba9e0170e1ed1b79',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYEE',
        state: null,
        taxCode: 'FE0000-005',
        taxType: TaxType.Federal,
      },
      {
        id: 'bbcdaaa9c9c94f88a73a0170e1ed1b79',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'FEDERAL WITHHOLDING',
        state: null,
        taxCode: 'FE0000-001',
        taxType: TaxType.Federal,
        'filingStatus': FilingStatus.Single,
      },
      {
        id: 'ae705f6c6d7d4bdca8cc0170e1ed1b79',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'SOC SEC EMPLOYER',
        state: null,
        taxCode: 'FE0000-004',
        taxType: TaxType.Federal,
      },
      {
        id: 'eee4af76d2db415bb8e50170e1ed1b79',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'MED EMPLOYER',
        state: null,
        taxCode: 'FE0000-006',
        taxType: TaxType.Federal,
      },
      {
        id: '88f682be3c86487a8fc10170e1ed1b7a',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'FEDERAL UNEMPLOYMENT EMPLOYER',
        state: null,
        taxCode: 'FE0000-010',
        taxType: TaxType.Federal,
      },
      {
        id: '15cfbec1aed0435da9800170e1ed1b7a',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA STATE UNEMPLOYMENT EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-010',
        taxType: TaxType.State
      },
      {
        id: '2c8e79f8263e49aca47f0170e1ed1b7a',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA MODIFIED BUSINESS TAX EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-134',
        taxType: TaxType.State
      },
      {
        id: '2684da1af0394bce84d00170e1ed1b7a',
        companyId,
        employeeId: cathyId,
        isExempt: false,
        withholdingAllowance: 0,
        extraWithholding: 0,
        name: 'NEVADA CAREER ENHANCEMENT EMPLOYER',
        state: 'NV',
        taxCode: 'NV0000-131',
        taxType: TaxType.State
      }

    ];

    return { company, employees, employeeTaxes }
  }

}
