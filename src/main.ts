import { enableProdMode, ENVIRONMENT_INITIALIZER, inject, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router';

import { AppComponent } from '@app/app.component';
import { appRoutes } from '@app/app.routes';
import { environment } from '@environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DataService, RemoteDataService } from '@services';

import { appValidationContextProvider,  validationSuiteProviders } from '@validators';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
    importProvidersFrom(RouterModule.forRoot(appRoutes)),
    appValidationContextProvider,
    validationSuiteProviders,
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
