import { PreloadReduxBridgeReturn, PreloadWindowBridgeReturn } from '../../shared/electronBridge/preload';
import { State } from '../../shared/redux/slices';
import { UnknownAction } from '@reduxjs/toolkit';

declare global {
    interface Window {
        reduxtron: PreloadReduxBridgeReturn<State, UnknownAction>;
        system: PreloadWindowBridgeReturn;
    }
}
