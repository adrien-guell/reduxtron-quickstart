import { all } from 'typed-redux-saga';
import createSagaMiddleware from 'redux-saga';
import * as redux from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { slices } from '../../shared/redux/slices';

export type Reducers = Record<string, redux.Slice['reducer']>;

const allSagas = [];

const reducers: Reducers = {};
for (const sliceKey in slices) {
    reducers[sliceKey] = slices[sliceKey].slice.reducer;
}

const sagas = function* (): Generator {
    yield* all(allSagas);
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: { ...reducers },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(sagas);

export default store;
