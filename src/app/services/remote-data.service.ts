import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

import { createDemoData } from './demo-data';
import { Company } from '@model';
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

  /** Return terminating observable of list of companies in the mock db */
  getCompanyList(): Observable<CompanyListItem[]>{
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
    this.db = createDemoData() || new Db();
    this.storeDb();
    return this.db;
  }

  private storeDb() {
    window.localStorage.setItem(dbKey, JSON.stringify(this.db));
  }
}
