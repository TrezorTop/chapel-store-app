import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import User from "../../models/User";


const saltRounds = 10;

export type JwtAccessTokenPayload = {
	owner: string
}

export async function getUserByUsername(username: string) {
	const user = await User.findOne({ username: username }).exec();

	return user;
}

export function generateAccessToken(username: string) {
	const payload = {
		owner: username
	} satisfies JwtAccessTokenPayload;

	return jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "1h" });
}


export async function hashPassword(password: string) {
	const hash = await bcrypt.hash(password, saltRounds);
	return hash;
}