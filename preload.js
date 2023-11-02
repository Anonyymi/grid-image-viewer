const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {
    exit: () => ipcRenderer.invoke('app:exit'),
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    getFilesInDirectory: (data) => ipcRenderer.invoke('app:getFilesInDirectory', data),
})
