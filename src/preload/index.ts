import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
interface RendererAPI {
  onGetConfig: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => void
  onOpenFileDialog: (_event: Electron.IpcRendererEvent, _data: any) => Promise<any>
  onSaveFileDialog: (data: string) => Promise<any>
}

const api: RendererAPI = {
  onGetConfig: (callback) => {
    ipcRenderer.on('get-config', (event, data) => {
      callback(event, data)
    })
  },
  onOpenFileDialog: (_event, _data) => ipcRenderer.invoke('open-file-dialog'),
  onSaveFileDialog: (data) => ipcRenderer.invoke('save-file-dialog', data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // Fallback for older Electron versions or when context isolation is disabled.
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
