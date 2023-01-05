import { Validator } from "./types";


export const makeOptionalValidator = <T>(validator: Validator<T>): Validator<T> => {
	return Object
	.keys(validator)
	.reduce<Validator<T>>((v, curr) => {
		v[curr as keyof T] = {
			check: validator[curr as keyof T].check,
			required: false
		};

		return v;
	}, {} as Validator<T>);
};