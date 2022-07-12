import { Injectable, Inject } from '@angular/core';

import { AppValidationContext } from '@validators/app-validation-context';
import { Company } from '@model';
import { companySyncValidationSuite, companyAsyncValidationSuite } from '@validators';
import { VALIDATION_CONTEXT } from '@validation/validation-context';

@Injectable({ providedIn: 'root' })
export class CompanyFormValidationDemo {

  constructor(@Inject(VALIDATION_CONTEXT) private appValidationContext: AppValidationContext) {
  }

  /** DEMO: validate the company form VM and display aspects of it in the browser console */
  demo(companyVm: Partial<Company>) {
    console.groupCollapsed('Company Vm State');
    console.log('vm', companyVm);

    companySyncValidationSuite.reset();
    const syncResult = companySyncValidationSuite(companyVm, undefined, undefined, this.appValidationContext);
    const syncErrors = syncResult.getErrors();
    console.log('company form vest synchronous validation state', syncResult);
    console.log('vest synchronous validation errors', syncErrors);

    companyAsyncValidationSuite.reset();
    companyAsyncValidationSuite(companyVm, undefined, undefined, this.appValidationContext)
      .done(asyncResult => {
        console.log('company form vest asynchronous validation state', asyncResult);
        const asyncErrors = asyncResult.getErrors()
        console.log('vest asynchronous validation errors', asyncErrors);
        console.groupEnd();
        const errorCount = Object.keys(syncErrors).length + Object.keys(asyncErrors).length;
        alert(`Has ${errorCount ? errorCount : 'no'} errors. Look at browser console.`);
      });
  }
}
