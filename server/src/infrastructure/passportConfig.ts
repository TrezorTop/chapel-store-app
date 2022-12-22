import { User as PrismaUser } from "@prisma/client";
import { RequestHandler } from "express";
import * as core from "express-serve-static-core";
import { StatusCodes } from "http-status-codes";
import passport, { AuthenticateOptions } from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { General_Unauthorized } from "../../../shared/consts/error";
import { getUserByUsername } from "../features/auth/services";
import { JwtAccessTokenPayload } from "../features/types";
import { ApplicationError } from "./applicationErrorHandler";


declare global {
	namespace Express {
		interface User extends PrismaUser {

		}
	}
}

export default function () {
	const opts: StrategyOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET
	};

	passport.use(new JwtStrategy(opts, async (jwt: JwtAccessTokenPayload, done) => {
		const user = await getUserByUsername(jwt.ownerUsername);

		done(null, user ?? false);
	}));
}


const jwtOptions: AuthenticateOptions = { session: false, failWithError: true };

export function jwtAuthMiddleware<
	P = core.ParamsDictionary,
	ResBody = any,
	ReqBody = any,
	ReqQuery = core.Query,
	Locals extends Record<string, any> = Record<string, any>
>(): RequestHandler<
	P,
	ResBody,
	ReqBody,
	ReqQuery,
	Locals
> {
	return (req, res, next) => {
		passport.authenticate("jwt", jwtOptions, (err, reqInner, resInner) => {
			if (!reqInner && (!resInner || resInner instanceof Error))
				throw new ApplicationError(StatusCodes.UNAUTHORIZED, General_Unauthorized);

			req.logIn(reqInner, jwtOptions, () => {
				next();
			});
		})(req, res, next);
	};
}