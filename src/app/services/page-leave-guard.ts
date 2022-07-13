import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
/**
 * Routing guard the asks a component if (when) the user can leave the page.
 * Implements the router's `CanDeactivate` by asking the component if it has
 * a `canLeave` method and calling that method if it does.
 * Because that method can be async, gives the component time to save or do something else
 * before leaving OR it can just cancel leaving.
 */
 @Injectable({ providedIn: 'root' })
 export class PageLeaveGuard implements CanDeactivate<any> {

   canDeactivate(
     component: any,
    //  currentRoute: ActivatedRouteSnapshot,
    //  currentState: RouterStateSnapshot,
    //  nextState?: RouterStateSnapshot
   ): Promise <boolean> | Observable<boolean> | boolean{

    if (component?.canLeave) {
      const res: Promise<boolean> | Observable<boolean> | boolean = component.canLeave();
      return res;
    } else {
      return true; // leave immediately because doesn't have `canLeave`
    }
   }
 }
