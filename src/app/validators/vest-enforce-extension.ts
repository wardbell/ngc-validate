/** Extend vest.enforce with external validation rules from the validator.js library
 * https://vestjs.dev/docs/enforce/consuming_external_rules
 * To take effect, must export something that is used somewhere else.
 * In this example, that "something" is the `extendVest` function.
 * Can't just call it here because would be "optimized" away.
 */
import { enforce } from 'vest';
import isEmail from 'validator/es/lib/isEmail';
import isPostalCode from 'validator/es/lib/isPostalCode';

/** Extend vest's `enforce` function with external validation rules from the validator.js library. */
export function extendVest() {
  enforce.extend({ isEmail, isPostalCode });
}
