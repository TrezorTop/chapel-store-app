import { User as PrismaUser } from "@prisma/client";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
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


export const jwtAuthMiddleware: RequestHandler = (req, res, next) => {
	passport.authenticate("jwt", { session: false, failWithError: true }, (err, req, res) => {
		if (!req && (!res || res instanceof Error))
			throw new ApplicationError(StatusCodes.UNAUTHORIZED, General_Unauthorized);
	})(req, res);

	next();
};