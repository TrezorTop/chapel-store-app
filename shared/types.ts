export type Validator<T> = {
	[Key in keyof T]: ((value: T[Key]) => boolean | string)[]
}

export type ServerValidationErrorsResponse = {
	body?: ServerValidationErrorResponse,
	query?: ServerValidationErrorResponse,
	params?: ServerValidationErrorResponse
}

export type ServerValidationErrorResponse = { [key: string]: string[] };