import { describe, it, expect, beforeEach } from 'vitest'
import { DataHandler } from '@/classes/DataHandler'
import ApiResponses from '@/enums/ApiResponses'
import { escapeString } from '@/main/utils/StringEscape'
import { MetaData, ExtractedData } from '@/models'
import { ConfigData } from '@/types/ConfigData'
import { promises as fs } from 'fs'
import { resolve } from 'path'

describe('DataHandler', async () => {
  let dataHandler: DataHandler
  const filePathJson = resolve(__dirname, 'test-data.json')
  const jsonData: ConfigData = await JSON.parse(await fs.readFile(filePathJson, 'utf-8'))

  beforeEach(() => {
    // Reset the singleton instance before each test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(DataHandler as any).instance = null
    dataHandler = DataHandler.getInstance()
  })

  it('should create a singleton instance', () => {
    const instance1 = DataHandler.getInstance()
    const instance2 = DataHandler.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should initialize dataObject with status undefined', () => {
    expect(dataHandler.dataObject.status).toBeUndefined()
  })

  it('should convert dataObject to JSON', () => {
    dataHandler.dataObject = {
      extractedData: jsonData.extractedData,
      metadata: jsonData.metadata,
      status: ApiResponses.RESOLVED_SUCCESSFULLY
    }
    const json = dataHandler.toJSON()
    expect(json).toBe(
      JSON.stringify({
        extractedData: jsonData.extractedData,
        metadata: jsonData.metadata
      })
    )
  })

  it('should set dataObject with error status', () => {
    const error = new Error('Test Error')
    dataHandler.setDataObject(error)
    expect(dataHandler.dataObject.status).toBe(ApiResponses.ERROR_RESOLVING_CONFIG)
  })

  it('should set dataObject with extractedData and metadata', () => {
    const processedResult = {
      extractedData: jsonData.extractedData!,
      metadata: jsonData.metadata!
    }
    dataHandler.setDataObject(processedResult)
    expect(dataHandler.dataObject.status).toBe(ApiResponses.RESOLVED_SUCCESSFULLY)
    expect(dataHandler.dataObject.extractedData).toEqual(processedResult.extractedData)
    expect(dataHandler.dataObject.metadata).toEqual(processedResult.metadata)
  })

  it('should add annotation to the correct channel', () => {
    dataHandler.dataObject = {
      extractedData: { channels: [{ id: '123', annotation: '' }] } as ExtractedData,
      metadata: { date: '2023-09-28 21:33:26', version: '4.4.0' } as MetaData,
      status: ApiResponses.RESOLVED_SUCCESSFULLY
    }
    const data = { channelId: '123', annotation: 'testAnnotation' }
    const escapedAnnotation = escapeString(data.annotation)
    const response = dataHandler.addAnnotation(data)
    expect(response).toBe(ApiResponses.RESOLVED_SUCCESSFULLY)
    expect(dataHandler.dataObject.extractedData!.channels[0].annotation).toBe(escapedAnnotation)
  })

  it('should handle error while adding annotation', () => {
    const data = { channelId: 'invalid', annotation: 'testAnnotation' }
    const response = dataHandler.addAnnotation(data)
    expect(response).toBe(ApiResponses.ERROR_RESOLVING_ANNOTATION)
  })

  it('should reset dataObject to initial state', () => {
    dataHandler.dataObject = {
      extractedData: jsonData.extractedData,
      metadata: jsonData.metadata,
      status: ApiResponses.RESOLVED_SUCCESSFULLY
    }
    const response = dataHandler.resetData()
    expect(response).toBe(ApiResponses.RESOLVED_SUCCESSFULLY)
    expect(dataHandler.dataObject.status).toBeUndefined()
  })
})
