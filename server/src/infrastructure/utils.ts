import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./applicationErrorHandler";


export const cancelIfFailed = async <T>(
	func: () => Promise<T>, status: StatusCodes,
	message: string
): Promise<NonNullable<T>> => {
	let result: T;

	try {
		result = await func();
	} catch (e) {
		throw new ApplicationError(status, message);
	}

	if (!result)
		throw new ApplicationError(status, message);

	return result;
};