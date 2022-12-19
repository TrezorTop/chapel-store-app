import { User as PrismaUser } from "@prisma/client";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { getUserByUsername } from "../features/auth/services";
import { JwtAccessTokenPayload } from "../features/types";


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


export const authMiddleware = passport.authenticate("jwt", { session: false });