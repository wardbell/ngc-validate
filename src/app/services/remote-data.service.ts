import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { createDemoData } from './demo-data';
import { Company, createCompany } from '@model';
import { CompanyData, CompanyListItem } from './data.service';
import { Db } from './db';
import { deepClone } from '@utils';

const dbKey = '_db';

/** Delay response by this number of milliseconds to simulate latency. */
const latencyDelayMs = 1500;

/** Simulate the behavior of a remote data service and API. */
@Injectable({ providedIn: 'root' })
export class RemoteDataService {

  private db = new Db();

  init() {
    let db: Db | undefined;
    const dbString = window.localStorage.getItem(dbKey);
    if (dbString) {
      try {
        db = JSON.parse(dbString);
        console.log('Loaded mock database from local storage');
      } catch (err) {
        console.error('Db in local storage is unreadable', err);
      }
    }
    this.db = db == null ? this.resetDb() : db;
  }

  createCompany(name?: string): Observable<CompanyData> {
    const data: CompanyData = {
      company: createCompany(name),
      employees: [],
      employeeTaxes: [],
    }
    return of(this.saveCompanyDataCore(data)).pipe(delay(latencyDelayMs));
  }

  /** Return terminating observable of list of companies in the mock db */
  getCompanyList(): Observable<CompanyListItem[]> {
    return of(this.db.Company).pipe(
      // Simulate time to load company list
      delay(latencyDelayMs),
      map(companies => {
        return companies.map(c => ({ id: c.id, name: c.legalName || '<unknown company name>' }))
      })
    )
  }

  /** Get the company data graph for the company with the given id. */
  getCompanyDataById(id: string): Observable<CompanyData> {
    const company = this.db.Company.find(c => c.id === id);
    if (company) {
      return this.getCompanyData(company);
    } else {
      const msg = `Company with id: ${id} not found.`;
      console.error(msg);
      // Simulate time to look for (and not find) the company by this id
      return throwError(() => msg).pipe(delay(latencyDelayMs));
    }
  }

  private getCompanyData(company: Company): Observable<CompanyData> {
    const id = company.id;
    const data: CompanyData = {
      company: deepClone(company),
      employees: this.db.Employee.filter(e => e.companyId === id).map(e => deepClone(e)),
      employeeTaxes: this.db.EmployeeTax.filter(et => et.companyId === id).map(et => deepClone(et)),
    }
    // Simulate time to load company
    return of(data).pipe(delay(latencyDelayMs));
  }

  /** Reset the remote mock database to its initial conditions. */
  resetDb() {
    console.log('(Re)created the mock database');
    this.db = createDemoData() ?? new Db();
    this.storeDb();
    return this.db;
  }

  saveCompanyData(companyData: CompanyData): Observable<boolean> {
    try {
      this.saveCompanyDataCore(companyData);
      return of(true).pipe(delay(latencyDelayMs));
    } catch (e) {
      console.error('RemoteDataService: Save CompanyData failed: ' + e);
      return throwError(() => 'Save CompanyData failed: ' + e);
    }
  }

  private saveCompanyDataCore(companyData: CompanyData): CompanyData {
    this.guardBadCompanyData(companyData);

    companyData = deepClone(companyData);
    const { company, employees, employeeTaxes } = companyData
    const companyId = company!.id;
    if (this.db.Company.some(c => c.id === companyId)) {
      // update existing company
      this.db.Company = this.db.Company.map(c => c.id === companyId ? company! : c);
      this.db.Employee = this.db.Employee.filter(ee => ee.companyId !== companyId).concat(employees);
      this.db.EmployeeTax = this.db.EmployeeTax.filter(et => et.companyId !== companyId).concat(employeeTaxes);
    } else {
      // add new company
      this.db.Company = this.db.Company.concat(company!);
      this.db.Employee = this.db.Employee.concat(employees);
      this.db.EmployeeTax = this.db.EmployeeTax.concat(employeeTaxes);
    }
    this.storeDb();
    return companyData;
  }

  /** Throw if the supplied data are structurally bad. */
  private guardBadCompanyData(companyData: CompanyData) {
    const { company, employees, employeeTaxes } = companyData;
    const companyId = company!.id;
    if (!companyId) {
      throw 'No company id';
    }
    if (!company!.legalName) {
      throw 'No company legalName';
    }
    if (employees.some(e => e.companyId !== companyId)) {
      throw 'An employee does not have the right companyId';
    }
    if (employees.some(e => !e.id || 1 !== employees.filter(e2 => e2.id === e.id).length)) {
      throw 'There are blank or duplicate employee ids';
    }
    if (employeeTaxes.some(et => et.companyId !== companyId)) {
      throw 'An employee tax does not have the right companyId';
    }
    if (employeeTaxes.some(et => !et.id || 1 !== employeeTaxes.filter(et2 => et2.id === et.id).length)) {
      throw 'There are blank or duplicate employeeTax ids';
    }
  }

  private storeDb() {
    window.localStorage.setItem(dbKey, JSON.stringify(this.db));
  }
}
