/**
 * Returns number as hh:mm string
 * @param value - number should conform to hhmm expectations
 */
export function numberToTime(value: number): string {
  let t = ("0" + value.toString()).slice(-4);
  return t.slice(0,2) + ":" + t.slice(-2);
}