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
