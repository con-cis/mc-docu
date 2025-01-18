import { describe, it, expect } from 'vitest'
import { processJsonFile } from '@/main/modules/jsonProcessing/JsonProcessingService'
import { promises as fs } from 'fs'
import { resolve } from 'path'
import { ConfigData } from '@/types/ConfigData'

describe('JsonProcessingService', () => {
  it('should process valid JSON data correctly', async () => {
    const filePathJson = resolve(__dirname, 'test-data.json')
    const jsonData: ConfigData = await JSON.parse(await fs.readFile(filePathJson, 'utf-8'))

    const validJson = JSON.stringify({
      extractedData: jsonData.extractedData,
      metadata: jsonData.metadata
    })

    const result = await processJsonFile(validJson)
    if (result instanceof Error) {
      throw result
    }

    expect(result.extractedData).toEqual(jsonData.extractedData)
    expect(result.metadata).toEqual(jsonData.metadata)
  })

  it('should throw an error for invalid JSON format', async () => {
    const invalidJson = JSON.stringify({
      wrongData: { data: 'testData' },
      metadata: { meta: 'testMeta' }
    })

    try {
      await processJsonFile(invalidJson)
    } catch (error) {
      expect((error as Error).message).toBe(
        'Invalid JSON format: The JSON data is missing required properties.'
      )
    }
  })

  it('should throw an error for malformed JSON', async () => {
    const malformedJson = '{"extractedData": {"data": "testData", "metadata": {"meta": "testMeta"}'

    try {
      await processJsonFile(malformedJson)
    } catch (error) {
      expect((error as Error).message).toContain('Error processing JSON file')
    }
  })
})
