import fs from 'fs/promises'
import { processJsonFile } from '../jsonProcessing/JsonProcessingService'
import { processXmlFile } from '../xmlProcessing/XmlProcessingService'
import { openFileDialog, saveFileDialog } from './FileDialogService'
import { BrowserWindow, ipcMain } from 'electron'

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
  if (isJSON(content)) {
    return 'JSON'
  } else if (isXML(content)) {
    return 'XML'
  } else {
    return 'unknown format'
  }
}

export async function openFile() {
  try {
    const result = await openFileDialog()
    const mainWindow = BrowserWindow.getFocusedWindow()

    if (!result.canceled) {
      const filePath = result.filePaths[0]
      const processedResult = await readFileAndProcess(filePath)
      const dataObject = {
        extractedData: processedResult.extractedData,
        metadata: processedResult.metadata
      }
      mainWindow?.webContents.send('get-config', dataObject)
      return 'Resolved successfully'
    } else {
      mainWindow?.webContents.send('get-config', null)
      return 'Operation cancelled'
    }
  } catch (error) {
    console.error('Error:', error)
    return 'Error while resolving config file'
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
      return 'Resolved successfully'
    } else {
      return 'Operation cancelled'
    }
  } catch (error) {
    console.error('Error:', error)
    return 'Error while resolving config file'
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
