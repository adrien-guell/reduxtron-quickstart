import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Log } from '../../models/log/Log';

export type LogQueueState = Log[];

const initialState: LogQueueState = [];

const name = 'logQueue' as const;

export const slice = createSlice({
    name,
    initialState,
    reducers: {
        append(state: LogQueueState, action: PayloadAction<Log>) {
            const logIndex = state.findIndex(log => log.id === action.payload.id);
            if (logIndex !== -1) {
                state[logIndex] = action.payload;
            } else {
                state.push(action.payload);
            }
            state = [
                ...state.filter(log => log.type === 'info'),
                ...state.filter(log => log.type === 'error'),
                ...state.filter(log => log.type === 'loading')
            ];
        },
        remove(state: LogQueueState, action: PayloadAction<string>) {
            return state.filter(log => log.id !== action.payload);
        },
        clear() {
            return initialState;
        }
    }
});

const actions = {
    ...slice.actions
};

export const logSlice = {
    slice,
    actions
};
