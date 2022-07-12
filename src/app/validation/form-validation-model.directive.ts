import { Directive, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidationContext } from './interfaces';

import { Indexable } from '@utils';

/** Set defaults validation model variables, scoped to a form, ngModelGroup, or an element with `val-model` attribute.
 * Must specify model and modelType to match this directive.
 */
@Directive({
  selector: 'form[model][modelType]:not([ngNoForm]):not([formGroup]),ng-form[model][modelType],[ngForm][model][modelType],[ngModelGroup][model][modelType],[val-model]',
  standalone: true,
})
export class FormValidationModelDirective implements OnChanges {
  /** data model whose properties will be validated. Required. */
  @Input() model: Indexable | undefined;

  /** Name of the type of model to be validated. Identifies the suite of validators to apply. Required.  */
  @Input() modelType: string | undefined;

  /** Group of tests within the validation suite. Only process tests in that group. */
  @Input() group?: string;

  /** Context that validators may reference for external information. */
  @Input() context?: ValidationContext;

  private modelChange = new Subject<any>();

  /** Observable that emits when any of the validation model inputs changed. */
  modelChanged = this.modelChange.asObservable();

  ngOnChanges(): void {
    this.modelChange.next(null);
  }
}
