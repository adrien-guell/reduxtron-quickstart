import { app, BrowserWindow, IpcMain } from 'electron';
import type { Store } from 'redux';
import { logger } from '../DI/logger';

export const mainReduxBridge = <S extends Store>(ipcMain: IpcMain, store: S) => {
    ipcMain.handle('getState', () => store.getState());
    ipcMain.on('dispatch', (_, action: Parameters<typeof store.dispatch>[0]) => {
        logger.debug('Dispatch', `Dispatching action of type: ${action.type}`);
        store.dispatch(action);
    });
    ipcMain.on('subscribe', event => {
        const unsubscribe = store.subscribe(() => event.sender.send('subscribe', store.getState()));
        app.on('quit', unsubscribe);
    });
};

export const mainWindowBridge = (ipcMain: IpcMain, mainWindow: BrowserWindow) => {
    ipcMain.on('minimizeWindow', () => mainWindow.minimize());
    ipcMain.on('maximizeWindow', () => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
    ipcMain.on('closeWindow', () => mainWindow.close());
};
