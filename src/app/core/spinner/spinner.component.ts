import { Component } from '@angular/core';
import { COMMON } from '@imports';
import { BusyService, BusyState } from '@services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/*
Spinner to display during long operations.
The outer div blocks the entire screen, so user cannot input while app is busy.
The inner div shows the spinner after a delay, so it won't show immediately.
The <input> captures keyboard events but stays offscreen.
*/
@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <ng-container *ngIf="busyState$ | async as busy">
      <div *ngIf="busy.isBusy" class="spinner-container">
        <div [hidden]="hideSpinner" class="spinner-shade">
          <div class="spinner-box">
            <div class="spinner-animation">
              <img src="/assets/images/green-spinner-on-white.gif" />
            </div>
            <div class="spinner-label">
              <h2>{{ busy.message }}</h2>
            </div>
          </div>
        </div>
        <input
          type="text"
          autofocus
          onkeydown="return false;"
          style="position: fixed; top:-200px; left:-200px"
        />
      </div>
    </ng-container>
  `,
  styleUrls: ['./spinner.component.scss'],
  imports: [COMMON]
})
export class SpinnerComponent {
  /** MS to delay before showing spinner and message. Static prop for ease of testing */
  static defaultDelayMs = 1000;

  busyState$: Observable<BusyState>;

  /** True when should hide the spinner and message */
  hideSpinner = true;

  private timeoutId: any;

  constructor(public busyService: BusyService) {
    this.busyState$ = busyService.busyState$.pipe(tap((state) => this.setSpinnerVisibility(state)));
  }

  // Manage delayable display of spinner and message when state changes
  private setSpinnerVisibility(state: BusyState) {
    if (state.isBusy) {
      if (state.delay) {
        // expose spinner after delay expires (if not previously delayed)
        if (!this.timeoutId) {
          this.timeoutId = setTimeout(
            () => (this.hideSpinner = false),
            SpinnerComponent.defaultDelayMs
          );
        }
      } else {
        // No delay. Expose spinner now and cancel pending delay (if any)
        clearTimeout(this.timeoutId);
        this.hideSpinner = false;
      }
    } else {
      // No longer busy. Hide spinner now and cancel pending delay (if any)
      clearTimeout(this.timeoutId);
      this.hideSpinner = true;
      this.timeoutId = undefined; // can delay next time.
    }
  }
}
