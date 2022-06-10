import { Directive, Input, OnChanges} from '@angular/core';
import { Subject } from 'rxjs';
import { ValidationContext } from './interfaces';

import { Indexable } from '@utils';

@Directive({
  selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm],[ngModelGroup]',
  standalone: true,
})
export class FormValidationDirective implements OnChanges {
  @Input('model') validationModel: Indexable | undefined;
  @Input('modelType') validationModelType: string | undefined;
  @Input('group') validationGroup: string | undefined;
  @Input('context') validationContext: ValidationContext | undefined;

  modelChange = new Subject<any>();

  ngOnChanges(): void {
    this.modelChange.next(null);
  }
}
