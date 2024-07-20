export function isJSON(content: string): boolean {
  try {
    JSON.parse(content)
    return true
  } catch (e) {
    return false
  }
}

export function isXML(content: string): boolean {
  // Check for a common XML opening tag
  return /<\s*\w+/.test(content)
}
