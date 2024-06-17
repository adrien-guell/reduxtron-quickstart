export type MapAsyncOptions =
    | {
          parallel: true;
      }
    | {
          parallel: false;
          batchSize?: number;
      };

declare global {
    interface Array<T> {
        partition(this: Array<T>, predicate: (value: T) => boolean): [T[], T[]];

        mapAsync<U>(
            this: Array<T>,
            callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
            options?: MapAsyncOptions
        ): Promise<U[]>;

        forEachAsync(
            this: Array<T>,
            callbackfn: (value: T, index: number, array: T[]) => Promise<void>,
            options?: MapAsyncOptions
        ): Promise<void | void[]>;

        maxBy(this: Array<T>, fn: (item: T) => number): T | undefined;

        sumBy(this: Array<T>, fn: (item: T) => number): number;

        joinBy(this: Array<T>, fn: (item: T) => string, separator?: string): string;

        replaceBy<U>(this: Array<T>, items: Array<T>, fn: (item: T) => U): this;

        move(this: Array<T>, fromIndex: number, toIndex: number): this;
    }
}

Array.prototype.partition = function <T>(this: Array<T>, predicate: (value: T) => boolean): [T[], T[]] {
    return this.reduce(
        (result, element) => {
            result[predicate(element) ? 0 : 1].push(element);
            return result;
        },
        [[] as T[], [] as T[]]
    );
};

Array.prototype.mapAsync = async function <T, U>(
    this: Array<T>,
    callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
    { parallel, batchSize = 1 } = {
        parallel: false,
        batchSize: 1
    }
): Promise<U[]> {
    if (parallel) return Promise.all(this.map(async (value, index, array) => await callbackfn(value, index, array)));
    else {
        const result: U[] = [];
        for (let i = 0; i < this.length; i++) {
            const promises: Promise<U>[] = [];
            for (let j = i; j < i + batchSize && j < this.length; j += batchSize) {
                promises.push(callbackfn(this[j], j, this));
            }
            result.push(...(await Promise.all(promises)));
        }
        return result;
    }
};

Array.prototype.forEachAsync = async function <T>(
    this: Array<T>,
    callbackfn: (value: T, index: number, array: T[]) => Promise<void>,
    { parallel, batchSize = 1 } = {
        parallel: false,
        batchSize: 1
    }
): Promise<void | void[]> {
    if (parallel) return Promise.all(this.map(async (value, index, array) => await callbackfn(value, index, array)));
    else {
        for (let i = 0; i < this.length; i++) {
            const promises: Promise<void>[] = [];
            for (let j = i; j < i + batchSize && j < this.length; j += batchSize) {
                promises.push(callbackfn(this[j], j, this));
            }
            await Promise.all(promises);
        }
    }
};

Array.prototype.maxBy = function <T>(this: Array<T>, fn: (item: T) => number): T | undefined {
    if (!this.length) return undefined;
    let max = this[0];
    this.forEach(item => {
        if (fn(item) > fn(max)) {
            max = item;
        }
    });
    return max;
};

Array.prototype.sumBy = function <T>(this: Array<T>, fn: (item: T) => number): number {
    let sum = 0;
    this.forEach(item => (sum += fn(item)));
    return sum;
};

Array.prototype.joinBy = function <T>(this: Array<T>, fn: (item: T) => string, separator = ' '): string {
    if (this.length <= 0) return '';
    let str = fn(this[0]);
    this.slice(1).forEach(item => (str += `${separator}${fn(item)}`));
    return str;
};

Array.prototype.replaceBy = function <T, U>(this: Array<T>, items: Array<T>, fn: (item: T) => U): Array<T> {
    for (const replace of items) {
        const index = this.findIndex(item => fn(item) === fn(replace));
        if (index >= 0) {
            this[index] = replace;
        } else {
            this.unshift(replace);
        }
    }
    return this;
};

Array.prototype.move = function <T>(this: Array<T>, fromIndex: number, toIndex: number): Array<T> {
    if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) return this;
    const element = this.splice(fromIndex, 1)[0];
    this.splice(toIndex, 0, element);
    return this;
};
