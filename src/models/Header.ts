/**
 * Interface representing a table header configuration
 * @interface Header
 * @property {string} title - The display title of the header
 * @property {string} key - Unique identifier for the header
 * @property {string} value - The value to be displayed in the header
 * @property {boolean} [sortable] - Whether the column is sortable
 * @property {("start"|"end"|"center"|undefined)} [align] - Text alignment within the header
 */
export interface Header {
  title: string
  key: string
  value: string
  sortable?: boolean
  align?: "start" | "end" | "center" | undefined
}
