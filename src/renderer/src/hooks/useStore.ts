import { initialSlices, State } from '../../../shared/redux/slices';
import { create } from 'zustand';

export const useStore = create<State>(setState => {
    window.reduxtron.subscribe(setState);
    window.reduxtron.getState().then(setState);
    return initialSlices;
});
