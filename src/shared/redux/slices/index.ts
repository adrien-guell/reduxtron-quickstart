import { createAction, Slice } from '@reduxjs/toolkit';
import { logSlice } from './LogSlice';

export const appActions = {
    appReady: createAction('app/ready')
};

export const slices = {
    log: logSlice
};

export const initialSlices: State = {} as State;
for (const sliceKey in slices) {
    initialSlices[sliceKey] = slices[sliceKey].slice.getInitialState();
}

export type ExtractState<T extends Record<string, { slice: Slice }>> = {
    [Key in keyof T]: T[Key]['slice'] extends Slice<infer State> ? State : never;
};

export type State = ExtractState<typeof slices>;
