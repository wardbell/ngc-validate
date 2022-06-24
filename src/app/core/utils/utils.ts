/** Deep clone an object (assumes no circularities) */
export function deepClone<T>(obj: T | null | undefined) {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

/** Interface for an object that can be indexed with a string key */
export interface Indexable<T = any> {
  [key: string]: T;
}
