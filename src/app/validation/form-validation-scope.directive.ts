import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidationContext } from './interfaces';

import { Indexable } from '@utils';

/** Set the validation scope variables on a form, ngModelGroup, or an element with a `val-model` attribute.
 * Must specify model and modelType to match this directive.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form[model][modelType]:not([ngNoForm]):not([formGroup]),ng-form[model][modelType],[ngForm][model][modelType],[ngModelGroup][model][modelType],[val-model]',
  standalone: true,
})
export class FormValidationScopeDirective implements OnChanges {
  /** data model whose properties will be validated. Required. */
  @Input() model: Indexable | undefined;

  /** Name of the type of model to be validated. Identifies the suite of validators to apply. Required.  */
  @Input() modelType: string | undefined;

  /** Group name of tests within the validation suite. Only process tests in that group. */
  @Input() group?: string;

  /** Context that validators may reference for external information and services. */
  @Input() context?: ValidationContext;

  private changeSubject = new Subject<any>();

  /** Observable that emits when any of the validation scope inputs changed. */
  changed = this.changeSubject.asObservable();

  ngOnChanges(_changes: SimpleChanges): void {
    this.changeSubject.next(null);
  }
}
