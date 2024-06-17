import { IpcRenderer } from 'electron';
import { UnknownAction } from '@reduxjs/toolkit';

type AnyState = Record<string, unknown>;

export type PreloadReduxBridgeReturn<S extends AnyState, A extends UnknownAction> = {
    dispatch: (action: A) => void;
    getState: () => Promise<S>;
    subscribe: (callback: (newState: S) => void) => () => void;
};

export const preloadReduxBridge = <S extends AnyState, A extends UnknownAction>(
    ipcRenderer: IpcRenderer
): PreloadReduxBridgeReturn<S, A> => ({
    dispatch: action => ipcRenderer.send('dispatch', action),
    getState: () => ipcRenderer.invoke('getState'),
    subscribe: (callback: (newState: S) => void): (() => void) => {
        ipcRenderer.send('subscribe');
        const subscription = (_: unknown, state: S): void => callback(state);
        ipcRenderer.on('subscribe', subscription);
        return () => {
            ipcRenderer.off('subscribe', subscription);
        };
    }
});

export type PreloadWindowBridgeReturn = {
    minimizeWindow: () => void;
    maximizeWindow: () => void;
    closeWindow: () => void;
};

export const preloadWindowBridge = (ipcRenderer: IpcRenderer): PreloadWindowBridgeReturn => ({
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
    closeWindow: () => ipcRenderer.send('closeWindow')
});
