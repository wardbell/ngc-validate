import { Indexable } from '@utils';

export interface Address extends Indexable {
  id: string;
  companyId: string;

  street: string;
  street2: string;
  city: string;
  state: string;
  postalCode:string;
}
