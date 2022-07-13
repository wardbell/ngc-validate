/** Deep clone an object (assumes no circularities) */
export function deepClone<T>(obj: T | null | undefined) {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

/** Interface for an object that can be indexed with a string key */
export interface Indexable<T = any> {
  [key: string]: T;
}

/** Return true if the two objects differ. A DEEP comparison using JSON.stringify.
 * Not forgiving of irrelevant differences such as property order and null/undefined properties.
 * Good enough for this demo app.
 * @param objectA object with potentially new or changed values
 * @param objectB, presumably an older version of the object.
 * @returns true if object A differs from object B
 */
export function areDifferent<T>(objectA: T, objectB: T): boolean {
  return JSON.stringify(objectA) !== JSON.stringify(objectB);
}
