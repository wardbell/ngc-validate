import { Component, AfterViewInit, ElementRef, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { NgModel, Validators } from '@angular/forms';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { formContainerViewProvider, Indexable } from '@core';
import { FORMS } from '@imports';
import { FormHooks, nameCounter, NgModelOptions, SelectOption, trim } from '@app/widgets/interfaces';
import { FormValidationModelDirective, ValidationContext } from '@validation';

@Component({
  selector: 'input-select',
  standalone: true,
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
    </select >
    <mat-error *ngIf="ngModel.errors" class="full-width">
      {{ ngModel.errors['error'] }}
    </mat-error>
  </mat-form-field>
  `,
  viewProviders: [formContainerViewProvider],
  imports: [FORMS],
})
export class InputSelectComponent implements OnInit, AfterViewInit {
  @Input() context?: ValidationContext;
  @Input()
  get disabled(): boolean { return this._disabled; };
  set disabled(value: BooleanInput) { this._disabled = coerceBooleanProperty(value); }
  private _disabled = false;

  @Input() field?: string;
  @Input() group?: string;
  @Input() label?: string;
  @Input() model?: Indexable;
  @Input() modelType?: string;
  @Input() name?: string;
  @Input() options: SelectOption[] = [];
  /** Display this text as the (disabled) first option when the model.field is "empty". */
  @Input() placeholderOption = '';

  @Input() updateOn?: FormHooks;

  /** Emit when the field value changes. */
  @Output() onChange = new EventEmitter<string | null>();

  @ViewChild('select') selectElRef?: ElementRef;
  @ViewChild('ngModel') ngModel?: NgModel;

  protected className: string;
  private currentValue: any | null = null;
  private hostEl: HTMLInputElement = this.hostElRef.nativeElement;
  protected ngModelOptions?: NgModelOptions;
  private originalValue: any | null = null;

  constructor(
    @Optional() private formValidation: FormValidationModelDirective,
    private hostElRef: ElementRef
  ) {
    this.className = this.hostEl.className;
  }

  ngOnInit(): void {
    this.model = this.model ?? this.formValidation.model;
    this.name = this.name || `${(this.field || '')}$${nameCounter.next}`;
    this.originalValue = trim(this.model ? this.model[this.field!] : null);
    this.currentValue = this.originalValue;
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

  protected get value(): any | null {
    return this.currentValue;
  }

  protected set value(value: any | null) {
    this.currentValue = value;
    if (this.model && this.field) {
      this.model[this.field] = this.currentValue;
    }
    this.onChange.emit(this.currentValue);
  }
}
