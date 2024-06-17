import { Identified } from '../Identified';
import { Progress } from '../Progress';

export type LoadingLog = Identified & {
    type: 'loading';
    progress: Progress;
    title: string;
};

export type ErrorLog = Identified & {
    type: 'error';
    title: string;
};

export type InfoLog = Identified & {
    type: 'info';
    title: string;
};

export type Log = ErrorLog | LoadingLog | InfoLog;
