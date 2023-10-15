import fs from 'fs/promises'
import { processJsonFile } from '../jsonProcessing/JsonProcessingService'
import { processXmlFile } from '../xmlProcessing/XmlProcessingService'
import { openFileDialog, saveFileDialog } from './FileDialogService'
import { BrowserWindow, ipcMain } from 'electron'
import ApiResponses from '../../../enums/ApiResponses'

async function readFileAndProcess(filePath: string) {
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

function getFileType(content: string) {
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

export async function openFile() {
  try {
    const result = await openFileDialog()
    const mainWindow = BrowserWindow.getFocusedWindow()
    let status: string

    if (!result.canceled) {
      const filePath = result.filePaths[0]
      const processedResult = await readFileAndProcess(filePath)
      const dataObject = {
        extractedData: processedResult.extractedData,
        metadata: processedResult.metadata
      }
      mainWindow?.webContents.send('get-config', dataObject)
      status = ApiResponses.RESOLVED_SUCCESSFULLY
    } else {
      mainWindow?.webContents.send('get-config', null)
      status = ApiResponses.OPERATION_CANCELLED
    }
    return status
  } catch (error) {
    console.error('Error:', error)
    return ApiResponses.ERROR_RESOLVING_CONFIG
  }
}

export async function saveFile(data: string) {
  try {
    const result = await saveFileDialog()
    // @ts-ignore
    if (!result.canceled && result.filePath.length > 0) {
      // @ts-ignore
      const filePath = result.filePath
      await fs.writeFile(filePath, data)
      console.info('Successfully saved')
      return ApiResponses.RESOLVED_SUCCESSFULLY
    } else {
      return ApiResponses.OPERATION_CANCELLED
    }
  } catch (error) {
    console.error('Error:', error)
    return ApiResponses.ERROR_RESOLVING_CONFIG
  }
}

function isJSON(content: string) {
  try {
    JSON.parse(content)
    return true
  } catch (e) {
    return false
  }
}

function isXML(content: string) {
  // Check for a common XML opening tag
  return /<\s*\w+/.test(content)
}

ipcMain.handle('open-file-dialog', async (_event, _args) => {
  return await openFile()
})

ipcMain.handle('save-file-dialog', async (_event, data) => {
  return await saveFile(data)
})
