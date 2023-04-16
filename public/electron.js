
const path = require('path');
const { app, BrowserWindow,globalShortcut,webContents,ipcMain, nativeTheme,  Notification } = require('electron');
const isDev = require('electron-is-dev');
const { dirname } = require('path');
const currentWebContents = webContents.getFocusedWebContents();
function getIconFilePath() {
  if (process.platform === 'darwin') {
    return path.join(__dirname, 'electron-app-icon-mac.icns');
  } else if (process.platform === 'win32') {
    return path.join(__dirname, 'electron-app-icon.ico');
  } else {
    return path.join(__dirname, 'electron-app-icon.png');
  }
}


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: getIconFilePath(),

    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      accelerator: true,
    },
   
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
  return win;
}


 const NOTIFICATION_TITLE = "Basic Notification";
 const NOTIFICATION_BODY = "Notification from the Main process";

 function showNotification()  {
   new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
   }).show();
  }
 
app.whenReady().then(()=>{
  const win=createWindow();
 
  globalShortcut.register('CommandOrControl+O', () => {
    win.webContents.executeJavaScript('document.querySelector("#popup-box").style.display="block"')
  });
  globalShortcut.register('CommandOrControl+X', () => {
    win.webContents.executeJavaScript('document.querySelector("#popup-box").style.display="none"')
  });

  ipcMain.on('deck-deleted-notification', () => {
    const notification = new Notification({
      title: 'Deck deleted',
      body: 'The selected deck has been deleted.',
      silent: true // Optional, disables the notification sound
    });
    notification.show();
  });

}).then(showNotification);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return Promise.resolve(nativeTheme.shouldUseDarkColors)
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
  return Promise.resolve()
})