export interface Result<T> {
    data: T | undefined,
    error?: String
}