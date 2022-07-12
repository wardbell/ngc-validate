import { enableProdMode, ENVIRONMENT_INITIALIZER, inject, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router';

import { AppComponent } from '@app/app.component';
import { appRoutes } from '@app/app.routes';
import { environment } from '@environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataService, RemoteDataService } from '@services';

import { appValidationContextFactory, asyncValidationSuiteFactories, syncValidationSuites } from '@validators';
import { ASYNC_VALIDATION_SUITE_FACTORIES, SYNC_VALIDATION_SUITES } from '@validation/interfaces';
import { VALIDATION_CONTEXT } from '@validation/validation-context';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
    importProvidersFrom(RouterModule.forRoot(appRoutes)),
    { provide: ASYNC_VALIDATION_SUITE_FACTORIES, useValue: asyncValidationSuiteFactories },
    { provide: SYNC_VALIDATION_SUITES, useValue: syncValidationSuites },
    { provide: VALIDATION_CONTEXT, useFactory: appValidationContextFactory },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(RemoteDataService).init();
        inject(DataService).init();
      }
    }
  ]
}).catch(err => console.error(err));
