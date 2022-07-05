/** The empty GUID, result of new Guid() */
export const EMPTY_GUID = '00000000000000000000000000000000';

/**
 * Creates a pseudo-Guid (globally unique identifier) as 32 character string
 * whose trailing 6 bytes (12 hex digits) are time-based.
 * Also knows as a "GuidComb".
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part for testing
 */
export function getGuid(seed?: number) {
  // Each new Guid is greater than next if more than 1ms passes
  // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
  // Based on breeze.core.getUuid which is based on this StackOverflow answer
  // http://stackoverflow.com/a/2117523/200253
  //
  // Convert time value to hex: n.toString(16)
  // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
  // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
  //
  // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
  const timePart = ('00' + (seed ?? new Date().getTime()).toString(16)).slice(-12);
  return (
    'xxxxxxxxxxxx4xxxyxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) + timePart
  );
}
