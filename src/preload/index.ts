import { contextBridge, ipcRenderer } from 'electron'
import { ConfigData } from '../types/ConfigData'
import ApiResponses from '../enums/ApiResponses'

// Custom APIs for renderer
interface RendererAPI {
  onGetConfig: (callback: (event: Electron.IpcRendererEvent, data: ConfigData) => void) => void
  onOpenFileDialog: () => Promise<ApiResponses | Error>
  onSaveFileDialog: (data: ConfigData) => Promise<ApiResponses | Error>
  onSetAnnotation: (data: {
    channelId: string
    annotation: string
  }) => Promise<ApiResponses | Error>
  resetData: () => Promise<ApiResponses>
}

const api: RendererAPI = {
  onGetConfig: (callback) => {
    ipcRenderer.on('get-config', (event, data) => {
      callback(event, data)
    })
  },
  onOpenFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  onSaveFileDialog: (data: ConfigData) => ipcRenderer.invoke('save-file-dialog', data),
  onSetAnnotation: (data: { channelId: string; annotation: string }) =>
    ipcRenderer.invoke('set-annotation', data),
  resetData: () => ipcRenderer.invoke('reset-data')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
console.log(process.env.NODE_ENV)
if (process.contextIsolated) {
  try {
    // Expose APIs conditionally based on the environment
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      import('@electron-toolkit/preload')
        .then((module) => {
          const electronAPI = module.electronAPI
          contextBridge.exposeInMainWorld('electron', electronAPI)
        })
        .catch((err) => {
          console.error('Failed to load electronAPI in development mode:', err)
        })
    }
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
}
