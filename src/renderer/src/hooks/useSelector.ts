import { State } from '../../../shared/redux/slices';
import { useStore } from './useStore';
import { useEffect, useState } from 'react';
import equal from 'fast-deep-equal';

export const useSelector = <T>(selector: (state: State) => T): T => {
    const [value, setValue] = useState<T>(selector(useStore.getState()));
    useEffect(() => {
        return useStore.subscribe((state: State, prevState: State) => {
            const selected = selector(state);
            if (!equal(selector(prevState), selected)) {
                setValue(selected);
            }
        });
    });
    return value;
};
