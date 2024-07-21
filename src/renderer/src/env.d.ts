import { ElectronAPI } from '@electron-toolkit/preload'
import ApiResponses from 'src/enums/ApiResponses'
import { ConfigData } from 'src/types/ConfigData'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onGetConfig: (callback: (event: Electron.IpcRendererEvent, data: ConfigData) => void) => void
      onOpenFileDialog: () => Promise<ApiResponses>
      onSaveFileDialog: () => Promise<ApiResponses>
      onSetAnnotation: (data: { channelId: string; annotation: string }) => Promise<ApiResponses>
      resetData: () => Promise<ApiResponses>
      // Add other properties and methods as needed
    }
  }
}
