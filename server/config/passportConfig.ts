import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { getUserByUsername, JwtAccessTokenPayload } from "../features/auth";


const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
	issuer: "chapel",
	audience: "chapel"
};


export default function () {
	passport.use(new JwtStrategy(opts, async (jwt: JwtAccessTokenPayload, done) => {
		const user = await getUserByUsername(jwt.owner);

		done(user ?? "Authorization error");
	}));
}