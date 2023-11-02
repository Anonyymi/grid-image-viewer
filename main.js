const { app, dialog, BrowserWindow, ipcMain } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable: true,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')

    ipcMain.handle('app:exit', async (event) => {
        app.quit()
    })

    ipcMain.handle('dialog:openDirectory', async (event) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        })

        if (!canceled) {
            return filePaths[0]
        }

        return undefined
    })

    ipcMain.handle('app:getFilesInDirectory', async (event, data) => {
        const files = await fs.readdir(data.dir)
        return files
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
