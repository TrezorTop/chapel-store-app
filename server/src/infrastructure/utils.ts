import chalk from "chalk";
import { onResponseAsyncHookHandler } from "fastify";
import { isMultipart } from "fastify-multer/lib/lib/content-parser";
import { File } from "fastify-multer/src/interfaces";
import * as fs from "fs/promises";
import { IOptions } from "glob";
import glob from "glob-promise";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import winston, { format } from "winston";
import { ApplicationError } from "./applicationErrorHandler";


declare module "fastify" {
	interface FastifyRequest {
		isMultipart: typeof isMultipart;
		file: Required<File>;
		files: Required<File>[];
	}
}


export const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			level: "info",
			format: format.combine(
				format.metadata(),
				format.timestamp(),
				format.printf(({ level, message, timestamp, metadata }) => {
					return `${chalk.blueBright(timestamp)} [${chalk.yellowBright(level)}] — [${chalk.redBright(message)}]\n${JSON.stringify(metadata, null, 4)}`;
				})
			),
		})
	],
});

export const mailSender = nodemailer.createTransport(process.env.NODE_ENV === "development" ?
	{
		host: "127.0.0.1",
		port: 25,
		secure: false,
	} : {
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_MAIL,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

export const findSingleFile = async (pattern: string, options?: IOptions) => {
	const files = await glob(pattern, options);

	if (files.length !== 1)
		return null;

	return files[0];
};


export const removeTempFiles: onResponseAsyncHookHandler = async (request) => {
	await Promise.all(request.files.map(file => fs.rm(file.path, { force: true })));
};


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


export type NonNullableFields<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};