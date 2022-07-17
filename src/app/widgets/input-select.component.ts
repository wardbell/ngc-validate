import { Component, AfterViewInit, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { formContainerViewProvider, Indexable } from '@core';
import { FormHooks, nameCounter, NgModelOptions, SelectOption, trim } from '@app/widgets/interfaces';
import { FormValidationScopeDirective, ValidationContext } from '@validation';
import { InputErrorComponent } from '@app/widgets';
import { FormFieldNgModelDirective } from '@validation/form-field-ng-model.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'input-select',
  standalone: true,
  imports: [CommonModule, FormsModule, InputErrorComponent, MatInputModule, FormFieldNgModelDirective],
  viewProviders: [formContainerViewProvider],

  template: `
  <mat-form-field [ngClass]="className">
    <mat-label *ngIf="label">{{label}}</mat-label>
    <select matNativeControl
      [disabled]="disabled"
      [field]="field"
      [model]="model" [modelType]="modelType" [group]="group"
      [name]="name!"
      [(ngModel)]="value"
      [ngModelOptions]="ngModelOptions!"
      (keyup.esc)="escaped()"
      #select #ngModel="ngModel">
        <option *ngIf="showPlaceholderOption" [value]="value" disabled>
          {{ placeholderOption }}
        </option>
        <option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">
          {{ option.name }}
        </option>
    </select>
  </mat-form-field>
  <input-error [control]="ngModel.control"></input-error>
  `,
})
export class InputSelectComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy  {
  @HostBinding('class') get klass() { return this.className; }
  @Input() context?: ValidationContext;
  @Input()
  get disabled(): boolean { return this._disabled; };
  set disabled(value: BooleanInput) { this._disabled = coerceBooleanProperty(value); }
  private _disabled = false;

  @Input() field?: string;
  @Input() group?: string;
  @Input() label?: string;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('model') inputModel?: Indexable;
  @Input() modelType?: string;
  @Input() name?: string;
  @Input() options: SelectOption[] = [];
  /** Display this text as the (disabled) first option when the model.field is "empty". */
  @Input() placeholderOption = '';

  @Input() updateOn?: FormHooks;

  /** Emit when the field value changes. */
  @Output() changed = new EventEmitter<string | null>();

  @ViewChild('select') selectElRef?: ElementRef;
  @ViewChild('ngModel') ngModel?: NgModel;

  protected className: string;
  private hostEl: HTMLInputElement = this.hostElRef.nativeElement;
  model?: Indexable;
  protected ngModelOptions?: NgModelOptions;
  originalValue: any | null = null;
  scopeSub?: Subscription;

  get value() {
    return this.model![this.field!];
  }

  set value(val: any | null) {
    if (this.field) {
      this.model![this.field] = val;
    }
    this.changed.emit(val);
  }
  constructor(
    @Optional() private formValidationScope: FormValidationScopeDirective,
    private hostElRef: ElementRef
  ) {
    // Apply the class attribute on the host; if none, apply app standard CSS classes
    this.className = this.hostEl.className || "col full-width";
  }

  ngOnChanges(): void {
    // only care about inputModel and updateOn changes; changes to other input vars are ignored.
    // inputModel trumps validation scope model
    this.model = this.inputModel ?? this.formValidationScope?.model ?? {};
    if (this.updateOn) {
      this.ngModelOptions = { updateOn: this.updateOn };
    }
  }

  ngOnInit(): void {
    this.model = this.model ?? this.formValidationScope?.model ?? {};
    this.field = this.field || this.name;
    this.name = this.name || `${(this.field || '')}$${nameCounter.next}`;
    this.originalValue = trim(this.model ? this.model[this.field!] : null);
    if (this.updateOn) {
      this.ngModelOptions = { updateOn: this.updateOn };
    }
  }

  ngAfterViewInit() {
    if (this.hostEl.hasAttribute('required')) {
      // Pass it along to the nested input element
      // Wait a tick to bypass ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        // Adding the required validator triggers Angular Material
        // to add the required attribute and update the label with the required marker.
        this.ngModel!.control.addValidators(Validators.required);
        this.ngModel!.control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  ngOnDestroy(): void {
    this.scopeSub?.unsubscribe();
  }

  /** User pressed escape. Restores original value */
  protected escaped() {
    const currentValue = this.selectElRef!.nativeElement.value;
    if (currentValue !== this.originalValue) {
      this.value = this.originalValue;
    }
  }

  get showPlaceholderOption() {
    return this.placeholderOption && (this.value === '' || this.value == null);
  }
}
