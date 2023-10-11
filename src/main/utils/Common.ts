import { MenuItemConstructorOptions } from 'electron'

export function configureMenu(
  appName: string,
  openFileCallback: () => Promise<string>,
  saveFileCallback: (data: any) => Promise<string>
): MenuItemConstructorOptions[] {
  return [
    {
      label: appName,
      submenu: [
        {
          label: 'About',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: openFileCallback
        },
        {
          label: 'Save File',
          accelerator: 'CmdOrCtrl+S',
          click: saveFileCallback
        }
      ]
    }
  ]
}
