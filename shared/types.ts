export type Validator<T> = {
	[Key in keyof T]: ((value: T[Key]) => boolean | string)[]
}