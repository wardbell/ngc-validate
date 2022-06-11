import { Indexable } from '@utils';

export interface Address extends Indexable {
  street: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  postalCode:string | null;
}
