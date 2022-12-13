import { RequestHandler } from "express";
import * as core from "express-serve-static-core";
import { ApplicationError } from "./applicationErrorHandler";


export function cancelIfFalsy<T>(target: T, error: ApplicationError): asserts target is NonNullable<T> {
	if (!target)
		throw error;
}


export function asyncWrapper<
	P = core.ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery = core.Query,
	Locals extends Record<string, any> = Record<string, any>
>(handler: RequestHandler<
	P,
	ResBody,
	ReqBody,
	ReqQuery,
	Locals
>) {
	const changedHandler: RequestHandler<
		P,
		ResBody,
		ReqBody,
		ReqQuery,
		Locals
	> = (req, res, next) => {
		// @ts-ignore
		handler(req, res, next).catch((err) => next(err));
	};

	return changedHandler;
}