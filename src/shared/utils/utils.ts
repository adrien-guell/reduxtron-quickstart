export const removeNonSerializableFields = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
        // Return the value if it is not an object or an array.
        return obj;
    }

    if (Array.isArray(obj)) {
        // Recursively filter each element of the array.
        return obj.map(removeNonSerializableFields) as unknown as T;
    }

    // Construct a new object by recursively processing each key-value pair
    // of the original object, omitting non-serializable values.
    const filteredObject: Record<string, unknown> = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value !== 'undefined' && typeof value !== 'function') {
            filteredObject[key] = removeNonSerializableFields(value);
        }
    });

    return filteredObject as T;
};
