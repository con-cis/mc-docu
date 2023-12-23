import { BrowserWindow, dialog } from 'electron'

export function openFileDialog() {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    const options = {
      filters: [{ name: 'xml, JSON Files', extensions: ['xml', 'json'] }]
    }
    return dialog.showOpenDialog(mainWindow, options)
  } else {
    console.error('No focused window found.')
    return Promise.resolve({ canceled: true, filePaths: [] })
  }
}

export function saveFileDialog() {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    const options = {
      filters: [{ name: 'JSON', extensions: ['json'] }]
    }
    return dialog.showSaveDialog(mainWindow, options)
  } else {
    console.error('No focused window found.')
    return Promise.resolve({ canceled: true, filePath: [] })
  }
}
