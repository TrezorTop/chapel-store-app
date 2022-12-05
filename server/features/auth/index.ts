import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import User from "../../models/User";


const saltRounds = 10;

export type JwtAccessTokenPayload = {
	owner: string;
};

export async function getUserByUsername(username: string) {
	return await User.findOne({ username: username }).exec();
}

export function generateAccessToken(username: string) {
	const payload: JwtAccessTokenPayload = {
		owner: username
	};

	return jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "10m" });
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}