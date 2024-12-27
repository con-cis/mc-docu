/**
 * File dialog utility functions for Electron application
 */

import { BrowserWindow, dialog } from 'electron'

/**
 * Opens a file selection dialog that allows choosing XML or JSON files
 * @returns Promise that resolves to dialog result containing:
 * - canceled: boolean indicating if dialog was canceled
 * - filePaths: array of selected file paths, empty if canceled
 */
export function openFileDialog(): Promise<
  Electron.OpenDialogReturnValue | { canceled: boolean; filePaths: [] }
> {
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

/**
 * Opens a file save dialog that allows saving JSON files
 * @returns Promise that resolves to dialog result containing:
 * - canceled: boolean indicating if dialog was canceled
 * - filePath: selected save path, empty if canceled
 */
export function saveFileDialog(): Promise<
  Electron.SaveDialogReturnValue | { canceled: boolean; filePath: [] }
> {
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
