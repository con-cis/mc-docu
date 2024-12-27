/**
 * @fileoverview Preload script that exposes APIs to the renderer process
 */

import { contextBridge, ipcRenderer } from 'electron'
import { ConfigData } from '../types/ConfigData'
import ApiResponses from '../enums/ApiResponses'

/**
 * Interface defining the API exposed to the renderer process
 */
interface RendererAPI {
  /**
   * Register callback for receiving config data from main process
   * @param callback Function to handle config data
   */
  onGetConfig: (callback: (event: Electron.IpcRendererEvent, data: ConfigData) => void) => void

  /**
   * Open file dialog to select config file
   * @returns Promise resolving to API response or error
   */
  onOpenFileDialog: () => Promise<ApiResponses | Error>

  /**
   * Save config data to file
   * @param data Config data to save
   * @returns Promise resolving to API response or error
   */
  onSaveFileDialog: (data: ConfigData) => Promise<ApiResponses | Error>

  /**
   * Set annotation for a channel
   * @param data Object containing channel ID and annotation text
   * @returns Promise resolving to API response or error
   */
  onSetAnnotation: (data: {
    channelId: string
    annotation: string
  }) => Promise<ApiResponses | Error>

  /**
   * Reset application data
   * @returns Promise resolving to API response
   */
  resetData: () => Promise<ApiResponses>
}

/**
 * Implementation of the renderer API
 */
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
