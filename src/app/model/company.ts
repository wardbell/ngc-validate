import { Address } from './address';
import { Indexable } from '@utils';

export interface Company extends Indexable {
  id: string;

  legalName: string | null;
  workAddress: Address;
}
