import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, first, map } from 'rxjs/operators';

import { BusyService } from './busy.service';
import { Cache, Company, Employee, EmployeeTax } from '@model';
import { RemoteDataService } from './remote-data.service';

/** Data graph for a single Company */
export interface CompanyData {
  company: Company | undefined;
  employees: Employee[];
  employeeTaxes: EmployeeTax[];
}

/** List of companies (for display in console) */
export interface CompanyListItem {
  id: string;
  name: string;
}

const currentCompanyIdKey = '_currentCompanyId';

/** Data access facade over ngrx-like observable store. */
@Injectable({ providedIn: 'root' })
export class DataService {

  private cacheSubject = new BehaviorSubject(new Cache());
  /** Observable of the application cache. Remember to unsubscribe. */
  cache$ = this.cacheSubject.asObservable();

  /** Observable of the current company's data graph. Remember to unsubscribe. */
  companyData$: Observable<CompanyData> = this.cache$.pipe(
    map(({company, employees, employeeTaxes}) => ({company, employees, employeeTaxes})));

  /** Observable of the current company record. Remember to unsubscribe. */
  company$: Observable<Company | undefined> = this.companyData$.pipe(
    map(({ company }) => company),
    distinctUntilChanged()
  );

  /** Observable of the current company's employees. Remember to unsubscribe. */
  employees$: Observable<Employee[]> = this.companyData$.pipe(
    map(({ employees }) => employees),
    distinctUntilChanged()
  );

  /** Observable of the current company's employee taxes. Remember to unsubscribe. */
  employeeTaxes$: Observable<EmployeeTax[]> = this.companyData$.pipe(
    map(({ employeeTaxes }) => employeeTaxes),
    distinctUntilChanged()
  );

  private errorSubject = new Subject<string>;
  /** Observable of data service errors as they happen.
   * Remember to unsubscribe.
   */
  errors$ = this.errorSubject.asObservable();

  constructor(
    private busyService: BusyService,
    private remoteDataService: RemoteDataService
  ) { }

  /** Return cached data at the moment of this method's execution. */
  cacheNow(): Cache {
    // This technique relies on synchronous nature of cache$.
    let cache: Cache;
    this.cache$.pipe(first()).subscribe(c => cache = c);
    return cache!;
  }

  /** Clear the company data graph currently in cache. */
  clearCachedCompany() {
    const cache = {
      ...this.cacheNow(),
      company: undefined,
      employees: [],
      employeeTaxes: [],
      currentCompanyId: '',
      loading: false,
    }
    window.localStorage.setItem(currentCompanyIdKey, '');
    this.cacheSubject.next(cache);
    return false;
  }

  /** Dump the app cache to the console for inspection. */
  dumpCache() {
    const cache = this.cacheNow();
    console.log('App Cache', cache);
  }

  /** Return terminating observable of list of companies in the mock db */
  getCompanyList(): Observable<CompanyListItem[]>{
    return this.busyService.busyNoDelay$('Loading ...', this.remoteDataService.getCompanyList());
  }

  /** Initialize the current company in cache when the app loads. */
  init(): void {
    let loader$: Observable<boolean>;
    let id = window.localStorage.getItem(currentCompanyIdKey);
    if (id == null) {
      // Demo start: never loaded a company before; load the first company.
      loader$ = this.remoteDataService.getCompanyList().pipe(
        concatMap(list => {
          id = list && list[0].id;
          return id ? this.loadCompanyById(id) : of(this.clearCachedCompany());
        })
      );
    } else {
      loader$ = this.loadCompanyById(id);
    }
    loader$.subscribe(
      _ => this.dumpCache() // diagnostic
    );
  }

  /** Load the cache with the company data graph for the company with the given id.
   * @returns Terminating observable that emits true if found and loaded or false if failed.
   */
  loadCompanyById(id: string): Observable<boolean> {
    const loader$ = this.remoteDataService.getCompanyDataById(id).pipe(
      catchError((msg: string) => {
        this.errorSubject.next(msg);
        console.error(msg);
        return of(null);
      }),
      map(companyData => this.loadCompanyDataToCache(companyData))
    );
    return this.busyService.busyNoDelay$('Loading company data ...', loader$);
  }

  private loadCompanyDataToCache(companyData: CompanyData| null | undefined): boolean {
    const currentCompanyId = companyData?.company?.id;
    if (currentCompanyId) {
      const cache = {
        ...this.cacheNow(),
        ...companyData,
        currentCompanyId,
        loading: false,
      }
      window.localStorage.setItem(currentCompanyIdKey, currentCompanyId);
      this.cacheSubject.next(cache);
      return true
    } else {
      this.clearCachedCompany(); // No company data => clear company data in cache.
      return false;
    }
  }

  /** Reload current company based on the currentCompanyId in local storage.
   * If the current company was already loaded, will reload from remote,
   * assuming that the currentCompanyId in local storage is the same as id of the loaded company
   * (as should be the case).
   */
  reloadCurrentCompany(): Observable<boolean> {
    const id = window.localStorage.getItem(currentCompanyIdKey);
    return id ? this.loadCompanyById(id) : of(this.clearCachedCompany());
  }

  /** Reset the remote mock database to its initial state. */
  resetDb() {
    this.remoteDataService.resetDb();
  }
}
