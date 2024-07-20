import { ipcMain } from 'electron'
import { openFile, saveFile } from '../main/modules/fileHandling/FileService'
import { DataHandler } from './DataHandler'

export class IpcHandler {
  private dataHandler: DataHandler

  constructor() {
    this.dataHandler = DataHandler.getInstance()
    this.registerHandlers()
  }

  private registerHandlers(): void {
    ipcMain.handle('open-file-dialog', async () => {
      await openFile()
    })

    ipcMain.handle('save-file-dialog', async () => {
      return await saveFile()
    })

    ipcMain.handle(
      'set-annotation',
      async (_event, data: { channelId: string; annotation: string }) => {
        return this.dataHandler.addAnnotation(data)
      }
    )

    ipcMain.handle('reset-data', async () => {
      return this.dataHandler.resetData()
    })
  }
}
