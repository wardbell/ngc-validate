import { Injectable } from '@angular/core';

import { ValidationContext } from './interfaces';
export { ValidationContext };

@Injectable({providedIn: 'root'})
export class ValidationContextService {
  context: ValidationContext;

  // TODO: inject service to maintain the data cache
  constructor() {
    this.context = {};
  }
}
