import { preValidationHookHandler } from "fastify/types/hooks";
import { KeysOf, UndefinedToUnknown } from "fastify/types/type-provider";
import { StatusCodes } from "http-status-codes";
import { ServerValidationErrorResponse, ServerValidationErrorsResponse, Validator } from "../../../shared/types";


type RequestValidator<TBody, TParams, TQuery> = {
	body?: Validator<UndefinedToUnknown<KeysOf<TBody> extends never ? unknown : TBody>>,
	params?: Validator<UndefinedToUnknown<KeysOf<TParams> extends never ? unknown : TParams>>,
	query?: Validator<UndefinedToUnknown<KeysOf<TQuery> extends never ? unknown : TQuery>>
}


export const validatePreValidationHook = <TBody = unknown, TParams = unknown, TQuery = unknown>(
	validator: RequestValidator<TBody, TParams, TQuery>
): preValidationHookHandler => {
	return async (request, reply) => {
		const bodyRawErrors = collectErrors(request.body ?? {}, validator.body ?? {});
		const queryRawErrors = collectErrors(request.query, validator.query ?? {});
		const paramsRawErrors = collectErrors(request.params, validator.params ?? {});

		if (!bodyRawErrors.length && !paramsRawErrors.length && !queryRawErrors.length)
			return;

		const bodyErrors = convertToError(bodyRawErrors);
		const paramsErrors = convertToError(paramsRawErrors);
		const queryErrors = convertToError(queryRawErrors);

		return reply.status(StatusCodes.BAD_REQUEST).send({
			body: bodyErrors,
			params: paramsErrors,
			query: queryErrors
		} satisfies ServerValidationErrorsResponse);
	};
};

const convertToError = (rawErrors: [string, string[]][]): ServerValidationErrorResponse | undefined => {
	return rawErrors.length ? Object.fromEntries(rawErrors) : undefined;
};

const collectErrors = <T>(target: T, validator: Validator<T>) => {
	// @ts-ignore
	const targetKeys = Object.keys(target);
	const validatorKeys = Object.keys(validator);

	const requiredFieldsMissed = Object
	.entries(validator)
	.reduce<[string, string[]][]>((aggr, [key, value]) => {
		if ((value as Validator<T>[keyof Validator<T>]).required && !target[key as keyof T])
			aggr.push([key, ["Is required"]]);

		return aggr;
	}, []);

	if (requiredFieldsMissed.length > 0)
		return requiredFieldsMissed;

	if (targetKeys.length > 0 && validatorKeys.length === 0)
		throw new Error(`Validator not provided for ${JSON.stringify(target)}`);

	return Object
	.entries(target ?? {})
	.reduce<[string, string[]][]>((aggr, [key, value]) => {
		const validatorResults = validator[key as keyof T]
		.check
		.reduce<(string | boolean)[]>((aggr, curr) => aggr.concat(curr(value as T[keyof T])), [])
		.filter(curr => typeof curr === "string") as string[];

		if (validatorResults.length > 0)
			aggr.push([key, validatorResults]);

		return aggr;
	}, []);
};