import { Component, AfterViewInit, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormControl, NgModel, Validators } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';

import { Indexable } from '@core';
import { FormHooks, nameCounter, NgModelOptions, trim } from '@app/widgets/interfaces';
import { FormValidationScopeDirective, ValidationContext } from '@validation';

/** Base component for input element wrapper classes. Never instantiated! */
// Shouldn't have a Component decorator but Angular won't compile w/o it.
@Component({
  standalone: true,
  selector: 'app-input-base',
  template: ''
})
export abstract class InputBaseComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @HostBinding('class') protected get klass() { return this.className; }
  @Input() context?: ValidationContext;
  @Input()
  get disabled(): boolean { return this._disabled; };
  set disabled(value: BooleanInput) { this._disabled = coerceBooleanProperty(value); }
  protected _disabled = false;

  @Input() field?: string;
  @Input() group?: string;
  @Input() label?: string;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('model') inputModel?: Indexable;
  @Input() modelType?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() updateOn?: FormHooks;

  /** Emit when the field value changes. */
  @Output() changed = new EventEmitter<string | null>();

  @ViewChild('input') inputElRef?: ElementRef;
  @ViewChild('ngModel') ngModel?: NgModel;

  protected className: string;
  control?: FormControl;
  private hostEl: HTMLInputElement = this.hostElRef.nativeElement;
  model?: Indexable;
  protected ngModelOptions?: NgModelOptions;
  originalValue: any | null = null;
  scopeSub?: Subscription;

  get value() {
    return this.model![this.field!];
  }

  set value(val: string) {
    // TODO: coerce value to type of original value
    val = trim(val);
    if (this.field) {
      this.model![this.field] = val;
    }
    this.changed.emit(val);
  }

  constructor(
    @Optional() protected formValidationScope: FormValidationScopeDirective,
    protected hostElRef: ElementRef
  ) {
    // Apply the class attribute on the host; if none, apply app standard CSS classes
    this.className = this.hostEl.className || "col full-width";
    this.scopeSub = formValidationScope?.changed.subscribe(_ => this.ngOnChanges()) // might reset the model
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
    this.field = this.field || this.name;
    this.name = this.name || `${(this.field ?? '')}$${nameCounter.next}`;
    this.originalValue = trim(this.model![this.field!]);
  }

  ngAfterViewInit() {
    this.control = this.ngModel!.control;
    if (this.hostEl.hasAttribute('required')) {
      // Pass it along to the nested input element
      // Wait a tick to bypass ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        // Adding the required validator triggers Angular Material
        // to add the required attribute and update the label with the required marker.
        this.control!.addValidators(Validators.required);
        this.control!.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  ngOnDestroy(): void {
    this.scopeSub?.unsubscribe();
  }

  /** User pressed escape. Restores original value */
  protected escaped() {
    const elementValue = this.inputElRef!.nativeElement.value;
    if (elementValue !== this.originalValue) {
      this.value = this.originalValue;
    }
  }
}
