/**
 * @fileoverview Handles file operations including reading, processing and saving JSON/XML files
 */

import fs from 'fs/promises'
import { processJsonFile } from '../jsonProcessing/JsonProcessingService'
import { processXmlFile } from '../xmlProcessing/XmlProcessingService'
import { openFileDialog, saveFileDialog } from './FileDialogService'
import { BrowserWindow } from 'electron'
import ApiResponses from '../../../enums/ApiResponses'
import { DataHandler } from '../../../classes/DataHandler'
import { ExtractedData, MetaData } from '../../../models'
import { isJSON, isXML } from '../../utils/Validator'
import { IpcHandler } from '../../../classes/IpcHandler'

// Initialize IPC handlers
new IpcHandler()

const dataHandler = DataHandler.getInstance()

/**
 * Reads and processes a file from the given file path
 * @param filePath - Path to the file to be processed
 * @returns Object containing extracted data and metadata, or Error if processing fails
 */
async function readFileAndProcess(filePath: string): Promise<
  | {
      extractedData: ExtractedData
      metadata: MetaData
    }
  | Error
> {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const fileType = getFileType(data)

    if (fileType === 'JSON') {
      return await processJsonFile(data)
    } else if (fileType === 'XML') {
      return await processXmlFile(data)
    } else {
      throw new Error('The selected file is neither JSON nor XML.')
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

/**
 * Determines the type of file based on content
 * @param content - String content of the file
 * @returns 'JSON', 'XML' or 'unknown format'
 */
function getFileType(content: string): string {
  let format: string
  if (isJSON(content)) {
    format = 'JSON'
  } else if (isXML(content)) {
    format = 'XML'
  } else {
    format = 'unknown format'
  }
  return format
}

/**
 * Opens a file dialog and processes the selected file
 * @returns ApiResponse indicating the operation result
 */
export async function openFile(): Promise<ApiResponses> {
  const mainWindow = BrowserWindow.getFocusedWindow()

  try {
    const result = await openFileDialog()

    if (!result.canceled) {
      const filePath = result.filePaths[0]
      const processedResult = await readFileAndProcess(filePath)
      dataHandler.setDataObject(processedResult)
    } else {
      dataHandler.dataObject = { status: ApiResponses.OPERATION_CANCELLED }
    }
  } catch (error) {
    console.error('Error:', error)
    dataHandler.setDataObject(new Error())
  }
  mainWindow?.webContents.send('get-config', dataHandler.dataObject)
  if (dataHandler.dataObject?.status) {
    return dataHandler.dataObject.status
  } else {
    return ApiResponses.ERROR_RESOLVING_CONFIG
  }
}

/**
 * Opens a save file dialog and saves the current data
 * @returns ApiResponse indicating the operation result
 */
export async function saveFile(): Promise<ApiResponses> {
  try {
    const result = await saveFileDialog()
    if (!result.canceled && result.filePath!.length > 0) {
      const filePath = result.filePath as string
      await fs.writeFile(filePath, dataHandler.toJSON())
      console.info('Successfully saved to:', filePath)
      return ApiResponses.RESOLVED_SUCCESSFULLY
    } else {
      return ApiResponses.OPERATION_CANCELLED
    }
  } catch (error) {
    console.error('Error:', error)
    return ApiResponses.ERROR_RESOLVING_CONFIG
  }
}
