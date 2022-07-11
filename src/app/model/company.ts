import { Address } from './address';
import { Indexable } from '@utils';

export interface Company extends Indexable {
  id: string;

  /** Federal Employer Identification Number */
  fein?: string;
  legalName?: string;
  workAddress: Address;
}
