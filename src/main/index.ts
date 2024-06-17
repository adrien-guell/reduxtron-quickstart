import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { mainReduxBridge, mainWindowBridge } from '../shared/electronBridge/main';
import store from './redux/store';
import { appActions } from '../shared/redux/slices';

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 900,
        show: false,
        autoHideMenuBar: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            devTools: true,
            webSecurity: false
        }
    });

    mainReduxBridge(ipcMain, store);
    mainWindowBridge(ipcMain, mainWindow);

    mainWindow.webContents.openDevTools();

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron');
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();
    store.dispatch(appActions.appReady());

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
