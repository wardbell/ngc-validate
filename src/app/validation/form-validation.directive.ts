import { Directive, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ValidationContext } from './interfaces';

import { Indexable } from '@utils';

@Directive({
  selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm],[ngModelGroup]',
  standalone: true,
})
export class FormValidationDirective implements OnChanges {
  @Input() model: Indexable | undefined;
  @Input() modelType: string | undefined;
  @Input() group: string | undefined;
  @Input() context: ValidationContext | undefined;

  modelChange = new Subject<any>();

  ngOnChanges(): void {
    this.modelChange.next(null);
  }
}
