/**
 * IpcHandler class manages IPC (Inter-Process Communication) between the main and renderer processes.
 * It handles file operations and data management through registered event handlers.
 */
import { ipcMain } from 'electron'
import { openFile, saveFile } from '../main/modules/fileHandling/FileService'
import { DataHandler } from './DataHandler'

export class IpcHandler {
  /** Instance of DataHandler for managing application data */
  private dataHandler: DataHandler

  /**
   * Initializes the IpcHandler by getting DataHandler instance and registering IPC handlers
   */
  constructor() {
    this.dataHandler = DataHandler.getInstance()
    this.registerHandlers()
  }

  /**
   * Registers all IPC event handlers for the application
   * @private
   */
  private registerHandlers(): void {
    /**
     * Handles opening file dialog and loading file
     */
    ipcMain.handle('open-file-dialog', async () => {
      await openFile()
    })

    /**
     * Handles saving file dialog and saving file
     * @returns Promise with save operation result
     */
    ipcMain.handle('save-file-dialog', async () => {
      return await saveFile()
    })

    /**
     * Handles setting annotations for channels
     * @param _event - IPC event object
     * @param data - Object containing channelId and annotation string
     * @returns Promise with annotation operation result
     */
    ipcMain.handle(
      'set-annotation',
      async (_event, data: { channelId: string; annotation: string }) => {
        return this.dataHandler.addAnnotation(data)
      }
    )

    /**
     * Handles resetting all application data
     * @returns Promise with reset operation result
     */
    ipcMain.handle('reset-data', async () => {
      return this.dataHandler.resetData()
    })
  }
}
