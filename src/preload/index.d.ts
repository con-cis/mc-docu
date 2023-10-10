import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onGetConfig: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => void
      onOpenFileDialog: () => Promise<any>
      onSaveFileDialog: (data) => Promise<any>
      // Add other properties and methods as needed
    }
  }
}
