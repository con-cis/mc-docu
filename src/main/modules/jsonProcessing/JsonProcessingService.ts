import { MetaData, ExtractedData, ChannelData } from '../../../models'

/**
 * Process JSON data and return the parsed object.
 * @param jsonData - The JSON data as a string.
 * @returns An object containing extractedData, metadata, and the parsed JSON data.
 * @throws If the JSON data is not in the expected format.
 */
export async function processJsonFile(
  jsonData: string
): Promise<{ extractedData: ExtractedData; metadata: MetaData } | Error> {
  try {
    const result = JSON.parse(jsonData)

    if (isValidJson(result)) {
      return {
        extractedData: result.extractedData,
        metadata: result.metadata
      }
    } else {
      return new Error('Invalid JSON format: The JSON data is missing required properties.')
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    throw new Error(`Error processing JSON file: ${errorMessage}`)
  }
}

/**
 * Check if the parsed JSON object has the required properties.
 * @param obj - The parsed JSON object.
 * @returns True if the object has the required properties, false otherwise.
 */
function isValidJson(
  obj: any
): obj is ChannelData & { extractedData: ExtractedData; metadata: MetaData } {
  return typeof obj === 'object' && obj !== null && 'extractedData' in obj && 'metadata' in obj
}
