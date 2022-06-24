import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, finalize, scan, shareReplay, take } from 'rxjs/operators';

export interface BusyState {
  /** True if is busy */
  isBusy: boolean;
  /** Current busy service message */
  message: string;
  /** Should delay before showing spinner & message */
  delay: boolean;
}

export const notBusy: BusyState = { isBusy: false, message: '', delay: true };

@Injectable({ providedIn: 'root' })
export class BusyService {
  private busyCounter = 0;
  private busySubject = new BehaviorSubject(notBusy);

  busyState$ = this.busySubject.pipe(
    scan(
      (oldValue, value) => {
        return oldValue.isBusy === value.isBusy &&
          oldValue.message === value.message &&
          oldValue.delay === value.delay
          ? oldValue
          : { ...value };
      },
      { ...notBusy } as BusyState
    ),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Indicate busy until the source observable completes.
   * Display spinner (and message) after a delay if observable has not yet completed.
   * @param message The loading message to be displayed
   * @param source Observable that the busy service should watch
   * @return piped continuation of the source observable. Caller should subscribe to this.
   * Warning: busy and live forever if observable fails to terminate
   */
  busy$<T>(message: string, source: Observable<T>): Observable<T> {
    this.increment(message, false, true);
    return source.pipe(finalize(() => this.decrement()));
  }

  /**
   * Indicate busy until the observable completes,
   * Display spinner (and message) immediately
   * @param message The loading message to be displayed
   * @param source Observable that the busy service should watch
   * @return piped continuation of the source observable. Caller should subscribe to this.
   * Warning: busy and live forever if observable fails to terminate
   */
  busyNoDelay$<T>(message: string, source: Observable<T>): Observable<T> {
    this.increment(message, true, false);
    return source.pipe(finalize(() => this.decrement()));
  }

  /**
   * Increment the count of busy processes and set current message if no message pending.
   * Causes isBusy$ to emit true.
   * @param message The new current message
   * @param overrideMessage True if should override current message (default: false)
   * @param delay True if should delay displaying the spinner and message (default: true)
   */
  increment(msg?: string, overrideMessage = false, delay = true): void {
    this.busyCounter++;
    let oldState: BusyState;
    this.busyState$.pipe(take(1)).subscribe((state) => (oldState = state));

    // change message with caller's if provided and either there is no current message or should override it
    const message = msg && (!oldState!.message || overrideMessage) ? msg : oldState!.message;
    this.busySubject.next({ isBusy: true, message, delay });
  }

  /**
   * Decrement the count of busy processes.
   * If no more busy processes, clear the current message and indicate no longer busy
   * (isBusy$ emits false).
   * @param message The new current message
   */
  decrement(): void {
    if (this.busyCounter > 0) {
      this.busyCounter--;
    }
    if (this.busyCounter === 0) {
      this.busySubject.next(notBusy);
    }
  }
}
