import { Component, AfterViewInit, ElementRef, EventEmitter, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { formContainerViewProvider, Indexable } from '@core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormHooks, nameCounter, NgModelOptions, trim } from '@app/widgets/interfaces';
import { FormValidationModelDirective, ValidationContext, ValidationModule } from '@app/validation';

@Component({
  selector: 'input-text',
  standalone: true,
  template: `
  <mat-form-field [ngClass]="className">
    <mat-label *ngIf="label">{{label}}</mat-label>
    <input matInput
      [disabled]="disabled"
      [field]="field"
      [model]="model" [modelType]="modelType" [group]="group"
      [name]="name!"
      [(ngModel)]="value"
      [ngModelOptions]="ngModelOptions!"
      [placeholder]="placeholder!"
      [type]="type"
      (keyup.esc)="escaped()"
      (blur)="onBlur()"
      #input #ngModel="ngModel">
    <mat-error *ngIf="ngModel.errors" class="full-width">
      {{ ngModel.errors['error'] }}
    </mat-error>
  </mat-form-field>
  `,
  styles: ['.full-width { width: 100%; }'],
  viewProviders: [formContainerViewProvider],
  imports: [CommonModule, FormsModule, MatInputModule, ValidationModule],
})
export class InputTextComponent implements OnInit, AfterViewInit {
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
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() updateOn?: FormHooks;

  /** Emit when the field value changes. */
  @Output() onChange = new EventEmitter<string | null>();

  @ViewChild('input') inputElRef?: ElementRef;
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
    this.name = this.name || `${(this.field ?? '')}$${nameCounter.next}`;
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
    const currentValue = this.inputElRef!.nativeElement.value;
    if (currentValue !== this.originalValue) {
      this.value = this.originalValue;
    }
  }

  protected onBlur() {
    this.trimControlValue();
  }

  /** Trim the value in the ngModel control, which updates the screen and the value of the field in the parent form. */
  private trimControlValue() {
    if (this.ngModel?.control.value !== this.currentValue) {
      this.ngModel?.control.setValue(this.currentValue, { emitEvent: false });
    }
  }

  protected get value(): any | null {
    return this.currentValue;
  }

  protected set value(value: any | null) {
    // TODO: coerce value to type of original value
    this.currentValue = trim(value);
    if (this.model && this.field) {
      this.model[this.field] = this.currentValue;
    }
    this.onChange.emit(this.currentValue);
  }
}
