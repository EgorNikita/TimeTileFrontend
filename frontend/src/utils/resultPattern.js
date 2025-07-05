export function success(data) {
    return {
        isSuccess: true,
        isFailure: false,
        data,
        error: null,
    };
}

export function failure(error) {
    return {
        isSuccess: false,
        isFailure: true,
        data: null,
        error,
    };
}

export function isResultPattern(result) {
    return (
        result &&
        typeof result === 'object' &&
        typeof result.isSuccess === 'boolean' &&
        typeof result.isFailure === 'boolean' &&
        ('data' in result || 'error' in result)
    );
}