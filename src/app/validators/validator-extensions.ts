/**
 * Extend vest with rules from the validator.js library
 * https://www.npmjs.com/package/validator
 * https://vestjs.dev/docs/enforce/consuming_external_rules
 */
import { enforce } from 'vest';

import isEmail from 'validator/es/lib/isEmail';
import isPostalCode from 'validator/es/lib/isPostalCode';

enforce.extend({ isEmail, isPostalCode });
