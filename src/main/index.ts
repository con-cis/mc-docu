/**
 * @fileoverview Main electron application file that handles window creation, app lifecycle, and security settings
 * @module main
 * @requires electron
 * @requires path
 * @requires @electron-toolkit/utils
 * @requires ./utils/Common
 * @requires ./modules/fileHandling/FileService
 */
import { app, shell, BrowserWindow, Menu, session } from 'electron'
import { resolve, join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { configureMenu } from './utils/Common'
import { openFile, saveFile } from './modules/fileHandling/FileService'

/**
 * Creates and configures the main application window
 * @function createWindow
 * @returns {void}
 */
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    show: true,
    title: 'Mirth Connect Channel Documentation',
    autoHideMenuBar: false,
    webPreferences: {
      preload: resolve(__dirname, '../preload/index.js'),
      sandbox: process.env.NODE_ENV === 'production',
      disableBlinkFeatures: 'Auxclick',
      webSecurity: true,
      nodeIntegration: false,
      contextIsolation: true,
      allowRunningInsecureContent: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        ]
      }
    })
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// Create an OS-native style app menu bar
const template = configureMenu(app.name, openFile, saveFile) // Use a function to configure the menu
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
