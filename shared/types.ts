export type Validator<T> = {
  [Key in keyof T]: ((value: T[Key], values?: Partial<T>) => boolean | string)[];
};
