import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { areDifferent, deepClone } from '@utils';
import { Company } from '@model';
import { DataService } from '@services';

@Injectable({ providedIn: 'root'})
export class CompanyViewService {
  company$ = this.dataService.company$;
  constructor(private dataService: DataService) { }

  /** Build the CompanyVm for the current Company
   * @returns a terminating observable of a VM for that Company if it exists
   * else terminating observable of null.
  */
  getCompanyVm(): Observable<Company | null> {
    return this.dataService.company$.pipe(
      filter(co => co != null),
      take(1),
      map(co => deepClone(co))
    );
  }

   /** Save Company changes in the ViewModel, if there are any */
  saveCompanyVm(vm: Company | null): Observable<boolean> | boolean {
      const { company } = this.dataService.cacheNow();
      const newCo = { ...company, ...vm } as Company;
      if (areDifferent(company, vm)) {
        return this.dataService.saveCompanyData({ company: newCo });
      } else {
        return true; // no change
      }
  }
}
