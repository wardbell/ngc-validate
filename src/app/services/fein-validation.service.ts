import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { FeinValidationResponse, RemoteFeinValidationService } from './remote-fein-validation.service';
export { FeinValidationResponse };

@Injectable({ providedIn: 'root' })
export class FeinValidationService {

  constructor(private remoteFeinValidationService: RemoteFeinValidationService) { }

  /** Cache of FEIN Validation Response promises accumulated in this user session.
   * These promises may take time to resolve.
  */
  private responses: { [fein: string]: Promise<FeinValidationResponse> } = {};

  /** Check with the FEIN Validation Service if an FEIN/Legal Name combination is valid
   * @returns Promise of the service response. May be a cached response.
   */
  check(fein: string): Promise<FeinValidationResponse> {
    if (!isGoodFein(fein)) {
      return Promise.reject(`Bad FEIN "${fein}"`);
    }

    // Check the cached responses first.
    const cachedResponse = this.responses[fein];
    if (cachedResponse) {
      return cachedResponse;
    } else {
      const promise = firstValueFrom(this.remoteFeinValidationService.check(fein));
      this.responses[fein] = promise; // cache the promise of the response
      return promise;
    }
  }
}

/** Return true if the fein value is a well-formed FEIN number although it might not be a real FEIN. */
export function isGoodFein(fein?: string): boolean {
  return fein ? /\d{2}-\d{7}/.test(fein) : false;
}
