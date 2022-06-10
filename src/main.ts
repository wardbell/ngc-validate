import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule } from '@angular/router';

import { AppComponent } from '@app/app.component';
import { appRoutes } from '@app/app.routes';
import { environment } from '@environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { asyncValidators, validators } from '@model/validators/validators'
import { MODEL_ASYNC_VALIDATORS, MODEL_VALIDATORS } from '@app/validation/interfaces'

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    importProvidersFrom(RouterModule.forRoot(appRoutes)),
    {provide: MODEL_ASYNC_VALIDATORS, useValue: asyncValidators },
    {provide: MODEL_VALIDATORS, useValue: validators },
  ]
}).catch(err => console.error(err));
