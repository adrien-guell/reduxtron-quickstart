import { Progress } from './Progress';

export type SuccessfulData<T> = {
    status: 'Success';
    data: T;
    hasMore: boolean;
};

export type LoadingData = {
    status: 'Loading';
    progress: Progress;
    title: string;
};

export type FailureData<T> = {
    status: 'Failure';
    content?: T;
};

export type StatefulData<T, U = string> = LoadingData | SuccessfulData<T> | FailureData<U>;

export const Loading: <T, U>(progress?: Progress, title?: string) => StatefulData<T, U> = (
    progress = {
        progress: 0,
        total: 0
    },
    title = ''
) => ({
    status: 'Loading',
    progress,
    title
});
export const Success: <T, U>(data: T, hasMore?: boolean) => StatefulData<T, U> = (data, hasMore = true) => ({
    status: 'Success',
    data,
    hasMore
});
export const Failure: <T, U = string>(content?: U) => StatefulData<T, U> = content => ({
    status: 'Failure',
    content: content
});

export const unwrapSuccessData = <T>(data: StatefulData<T>) => {
    return data.status === 'Success' ? data.data : undefined;
};

export const hasMore = <T>(data: StatefulData<T>, defaultValue: boolean): boolean => {
    return data.status === 'Success' ? data.hasMore : defaultValue;
};

export const getStatefulDataField = <T, K extends keyof T>(sfData: StatefulData<T>, field: K): StatefulData<T[K]> => {
    return mapStatefulData(sfData, item => item[field]);
};

export const isStatefulListEmpty = <T>(sfData: StatefulData<T[]>): boolean =>
    (unwrapSuccessData(sfData)?.length ?? 0) === 0;

export const mapStatefulDataList = <T, U>(
    sfData: StatefulData<T[]>,
    iteratee: (value: T, index: number, array: T[]) => U
): StatefulData<U[]> => {
    return mapStatefulData(sfData, item => item.map(iteratee));
};

export const mapStatefulData = <T, U>(data: StatefulData<T>, mapper: (t: T) => U): StatefulData<U> => {
    switch (data.status) {
        case 'Success':
            return Success(mapper(data.data), data.hasMore);
        case 'Loading':
        case 'Failure':
            return data;
    }
};

export const updateStatefulData = <T>(data: StatefulData<T>, mapper: (t: T) => T): StatefulData<T> =>
    mapStatefulData<T, T>(data, mapper);

export const spliceStatefulData = <T>(
    data: StatefulData<T[]>,
    start: number,
    nbToDelete: number,
    ...itemsToAdd: StatefulData<T>[]
): void => {
    if (data.status === 'Success') {
        const items = itemsToAdd.reduce((acc, item) => {
            return item.status === 'Success' ? [...acc, item.data] : acc;
        }, [] as T[]);
        data.data.splice(start, nbToDelete, ...items);
    }
};

export const concatStatefulData = <T>(...items: StatefulData<T[]>[]): StatefulData<T[]> => {
    if (items.every(isFailure)) {
        return Failure(items[0].content);
    }

    const loadings = items.filter(isLoading);
    if (loadings.length >= 1) {
        return Loading(
            {
                progress: loadings.sumBy(item => item.progress.progress),
                total: loadings.sumBy(item => item.progress.total),
                message: loadings[0]?.progress?.message
            },
            loadings[0].title
        );
    }

    return Success(
        items.flatMap(item => (isSuccess(item) ? item.data : [])),
        items.some(item => isSuccess(item) && item.hasMore)
    );
};

export const concatSuccessfulData = <T, U>(...items: StatefulData<T[]>[]): SuccessfulData<T[]> => {
    return Success<T[], U>(
        items.flatMap(item => (isSuccess(item) ? item.data : [])),
        items.some(item => isSuccess(item) && item.hasMore)
    ) as SuccessfulData<T[]>;
};

export const concatUnSuccessfulData = <U>(...items: StatefulData<unknown[]>[]): LoadingData | FailureData<U> => {
    if (items.every(isFailure)) {
        return Failure() as LoadingData | FailureData<U>;
    }

    const loadings = items.filter(isLoading);
    if (loadings.length >= 1) {
        return Loading(
            {
                progress: loadings.sumBy(item => item.progress.progress),
                total: loadings.sumBy(item => item.progress.total),
                message: loadings.joinBy(item => item.progress.message ?? '', '; ')
            },
            loadings.joinBy(item => item.title)
        ) as LoadingData | FailureData<U>;
    }

    return Loading() as LoadingData | FailureData<U>;
};

export const isSuccess = <T, U>(
    statefulData: StatefulData<T, U> | LoadingData | SuccessfulData<T> | FailureData<U> | undefined
): statefulData is SuccessfulData<T> => statefulData?.status === 'Success';

export const areSuccess = <T extends unknown[], U>(
    statefulData: [...{ [K in keyof T]: StatefulData<T[K], U> }]
): statefulData is [...{ [K in keyof T]: SuccessfulData<T[K]> }] => {
    return statefulData.every(isSuccess);
};

export const isLoading = <T, U>(
    statefulData: StatefulData<T, U> | LoadingData | SuccessfulData<T> | FailureData<U> | undefined
): statefulData is LoadingData => statefulData?.status === 'Loading';

export const isFailure = <T, U>(
    statefulData: StatefulData<T, U> | LoadingData | SuccessfulData<T> | FailureData<U> | undefined
): statefulData is FailureData<U> => statefulData?.status === 'Failure';
