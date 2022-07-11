import { Indexable } from '@utils';
import { addressValidatorSuite } from './address.validator';
import { companyValidatorSuite } from './company.validator';
import { companyAsyncValidatorSuite } from './company.async-validator';

export const validators: Indexable = {
  address: addressValidatorSuite,
  company: companyValidatorSuite,
}

export const asyncValidators: Indexable = {
  company: companyAsyncValidatorSuite,
}
