const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  send: (channel, payload) => ipcRenderer.send(channel, payload),
  on: (channel, handler) => ipcRenderer.on(channel, (event, data) => handler(data))
})