import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, Observable, of } from 'rxjs';
import { filter, map, shareReplay, take, withLatestFrom } from 'rxjs/operators';

import { areDifferent, deepClone } from '@utils';
import { Employee, EmployeeType} from '@model';
import { DataService } from '@services';
import { SelectOption } from '@app/widgets/interfaces';

export const employeeTypes: SelectOption[] = [
  { name: 'Full Time', value: EmployeeType.FullTime },
  { name: 'Part Time', value: EmployeeType.PartTime },
  { name: '1099 Contractor', value: EmployeeType.Contractor }
];

@Injectable({ providedIn: 'root'})
export class EmployeeViewService {
  employees$ = this.dataService.employees$;
  constructor(
    private dataService: DataService,
    private router: Router,
  ) { }

  /** Build the EmployeeVm for the current EE (identified by the id in the active route).
   * @returns a terminating observable of a VM of that EE if it exists
   * else terminating observable of null.
   * If null, also navigates to the EE page because that's where you must go.
   * Beware: ShareReplay ensures this observable always emits the same ViewModel (or null) instance.
  */
  getEmployeeVm(): Observable<Employee | null> {
    const eeId = getIdFromUrl(this.router);
    return this.dataService.company$.pipe(
      filter(co => co != null), // wait for current company to be loaded
      take(1),
      withLatestFrom(this.dataService.employees$),
      map(([_company, employees]) => {
        const ee = employees.find(e => e.id == eeId);
        if (ee) {
          return deepClone(ee);
        } else {
          this.router.navigateByUrl('/employees');
          return null as Employee | null
        }
      }),
      shareReplay({bufferSize: 1, refCount: true })
    );
  }

   /** Save Employee changes in the ViewModel, if there are any */
  saveEmployeeVm(vm$: Observable<Employee | null>): Observable<boolean> | boolean {
    return vm$.pipe(
      take(1),
      concatMap(vm => {
        const eeId = vm?.id;
        if (eeId) {
          const { employees: oldEmployees } = this.dataService.cacheNow();
          const oldEe = oldEmployees.find(e => e.id === eeId);
          if (areDifferent(oldEe, vm)) {
            const employees: Employee[] = oldEmployees.map(e => e.id === eeId ? {...vm!} : e );
            return this.dataService.saveCompanyData({ employees });
          }
        }
        return of(true); // no change
      })
    )
  }
}

function getIdFromUrl(router: Router) {
  const match = router.url.match(/([^/.]*)$/);
  return match ? match[1] : null;
}
