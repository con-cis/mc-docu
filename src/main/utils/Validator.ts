/**
 * Checks if a string is valid JSON
 * @param {string} content - The string to check
 * @returns {boolean} True if the string is valid JSON, false otherwise
 */
export function isJSON(content: string): boolean {
  try {
    JSON.parse(content)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Checks if a string contains XML by looking for opening tags
 * @param {string} content - The string to check
 * @returns {boolean} True if the string appears to be XML, false otherwise
 */
export function isXML(content: string): boolean {
  // Check for a common XML opening tag
  return /<\s*\w+/.test(content)
}
