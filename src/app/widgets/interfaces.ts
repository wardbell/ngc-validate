import { Indexable } from '@utils';

/** Angular type for ngModelOptions.updateOn which is not exposed publicly.
 * @see https://github.com/angular/angular/blob/14.0.1/packages/forms/src/model/abstract_model.ts#L108
 */
export type FormHooks = 'change' | 'blur' | 'submit';

/** Angular type for ngModelOptions which is not exposed publicly.
 * @see https://github.com/angular/angular/blob/14.0.1/packages/forms/src/directives/ng_model.ts#L181-L198
 */
export interface NgModelOptions {
  name?: string;
  standalone?: boolean;
  updateOn?: FormHooks;
}

class NameCounter {
  counter = 0;
  get next() { return this.counter++; };
}
export const nameCounter = new NameCounter();

/** Interface for options passed to the <input-select> widget. */
export interface SelectOption {
  name: string;
  value: any;
  disabled?: boolean
}

/** Convert an indexable source into an array of SelectOptions for <input-select>. */
export function toSelectOptions(
  source: Indexable[] | null | undefined,
  /** Source property to be mapped to `name`. */
  nameProp ='name',
  /** Source property to be mapped to `value`. */
  valueProp ='value',
  /** Source property indicating if option is disabled (false by default). */
  disabledProp = 'disabled'
): SelectOption[] {
  return (source || []).map(opt =>
    ({
      name: opt[nameProp],
      value: opt[valueProp],
      disabled: opt[disabledProp] === true
    }));
}

/** Trim value if string. */
export function trim(value: any | null) {
  return typeof value === 'string' ? value.trim() : value;
}
