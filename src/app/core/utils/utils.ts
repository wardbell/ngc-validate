/** Interface for an object that can be indexed with a string key */
export interface Indexable<T = any> {
  [key: string]: T;
}
