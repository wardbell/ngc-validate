import { Address } from './address';
import { getGuid, Indexable } from '@utils';

export interface Company extends Indexable {
  id: string;

  /** Federal Employer Identification Number */
  fein?: string;
  legalName?: string;
  workAddress: Address;
}

export function createCompany(name?: string): Company {
  return {
    id: getGuid(),
    legalName: name,
    workAddress: {} as Address
  }
}
