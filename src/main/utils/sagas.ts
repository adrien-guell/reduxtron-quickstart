import { State } from '../../shared/redux/slices';
import { areSuccess, isSuccess, StatefulData, SuccessfulData } from '../../shared/models/StatefulData';
import { put, select } from 'typed-redux-saga';
import { randomUUID } from 'crypto';
import { Progress } from '../../shared/models/Progress';
import store from '../redux/store';
import { logSlice } from '../../shared/redux/slices/LogSlice';
import { ErrorLog, InfoLog, LoadingLog } from './log';
import { removeNonSerializableFields } from '../../shared/utils/utils';
import { throttle } from 'lodash';

export function* callWithStates<T extends unknown[]>(
    selector: (state: State) => [...{ [K in keyof T]: StatefulData<T[K]> }],
    fn: (...data: T) => Generator
) {
    const values = yield* select(selector);
    if (areSuccess(values)) {
        yield* fn(...(values.map((value: SuccessfulData<T[number]>) => value.data) as [...T]));
    }
}

export function* callWithState<T>(selector: (state: State) => StatefulData<T>, fn: (data: T) => Generator) {
    const values = yield* select(selector);
    if (isSuccess(values)) {
        yield* fn(values.data as T);
    }
}

export const getLoadingActions = (progressTitle: string) => {
    const id = randomUUID();
    return {
        onProgress: throttle(
            (progress: Progress) => store.dispatch(logSlice.actions.append(LoadingLog(progressTitle, progress, id))),
            1000,
            { trailing: false }
        ),
        onAbort: function* () {
            yield* put(logSlice.actions.remove(id));
        },
        onFinish: function* (title: string) {
            yield* put(logSlice.actions.append(InfoLog(title, id)));
        },
        onError: function* (error: unknown) {
            yield* put(logSlice.actions.append(ErrorLog(removeNonSerializableFields(error), id)));
        },
        onProgressGen: function* (progress: Progress) {
            yield* put(logSlice.actions.append(LoadingLog(progressTitle, progress, id)));
        },
        id
    };
};
