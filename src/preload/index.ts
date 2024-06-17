import '../shared/utils/collection';
import { contextBridge, ipcRenderer } from 'electron';
import { UnknownAction } from '@reduxjs/toolkit';
import { State } from '../shared/redux/slices';
import { preloadReduxBridge, preloadWindowBridge } from '../shared/electronBridge/preload';

const reduxBridge = preloadReduxBridge<State, UnknownAction>(ipcRenderer);
const windowBridge = preloadWindowBridge(ipcRenderer);

contextBridge.exposeInMainWorld('reduxtron', reduxBridge);
contextBridge.exposeInMainWorld('system', windowBridge);
