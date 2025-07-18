export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): T => {
    let timeoutId: NodeJS.Timeout;

    return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
};