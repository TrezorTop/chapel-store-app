export type Validator<T> = {
  [Key in keyof T]: {
    check: ((
	    value: Required<T>[Key],
	    values?: Partial<T>,
    ) => boolean | string)[],
    required: boolean
  };
};

export type ServerValidationErrorsResponse = {
  body?: ServerValidationErrorResponse;
  query?: ServerValidationErrorResponse;
  params?: ServerValidationErrorResponse;
};

export type ServerValidationErrorResponse = { [key: string]: string[] };
