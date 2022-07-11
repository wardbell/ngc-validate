import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Indexable } from '@core';

export interface FeinValidationResponse {
  fein: string;
  feinName?: string;
}

/** Delay response by this number of milliseconds to simulate latency. */
const latencyDelayMs = 2000;

const knownFeins: Indexable<string> = {
  '13-1234567': 'MARVELOUS PRODUCTS, INC.'
}

/** Mock the remote FEIN Validation Service */
@Injectable({ providedIn: 'root' })
export class RemoteFeinValidationService {
  /** Check if provided fein is registered with the IRS.
   * If the FEIN exists, return the FEIN and FEIN name.
   * If it doesn't, return the FEIN.
   * Special cases:
   * FEIN starting '22' is always valid and the FEIN name is the wildcard, '*'.
   * FEIN starting 66' is always invalid.
   */
  check(fein: string): Observable<FeinValidationResponse> {
    const response: FeinValidationResponse = { fein };
    const lead = fein.substring(0, 2); // mock response based on lead 2 digits.
    if (lead === '22') {
      response.feinName = '*'; // Always OK
    } else if (lead === '66') {
      // Always BAD
    } else {
      response.feinName = knownFeins[fein];
    }
    return of(response).pipe(delay(latencyDelayMs));
  }
}
