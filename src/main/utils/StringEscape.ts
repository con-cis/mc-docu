/**
 * Escapes special characters in a string to prevent injection attacks.
 * @param str - The input string to escape.
 * @returns The escaped string.
 */
export function escapeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;')
    .replace(/\//g, '&#47;')
    .replace(/\\/g, '&#92;')
    .replace(/\(/g, '&#40;')
    .replace(/\)/g, '&#41;')
}
