import { randomUUID } from 'node:crypto';
import { Log } from '../../shared/models/log/Log';
import { Progress } from '../../shared/models/Progress';

export const LoadingLog = (title: string, progress: Progress, id?: string): Log => ({
    id: id ?? randomUUID(),
    type: 'loading',
    title,
    progress
});

export const ErrorLog = (title: unknown, id?: string): Log => ({
    id: id ?? randomUUID(),
    type: 'error',
    title: title as string
});

export const InfoLog = (title: string, id?: string): Log => ({
    id: id ?? randomUUID(),
    type: 'info',
    title
});
