export type OnProgress = (progress: Progress) => void;
export type Progress = { progress: number; total: number; message?: string };
