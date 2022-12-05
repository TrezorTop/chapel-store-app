import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import RefreshToken from "../../models/RefreshToken";
import User from "../../models/User";


const saltRounds = 10;

export type JwtAccessTokenPayload = {
	owner: string;
};

export async function getUserByUsername(username: string) {
	return await User.findOne({ username: username }).exec();
}

export async function generateTokens(username: string, userId: string) {
	const payload: JwtAccessTokenPayload = {
		owner: username
	};
	const currentDate = new Date();
	const expiredAt = currentDate.setMonth(currentDate.getMonth() + 1);

	const accessToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "10m" });
	const refreshToken = new RefreshToken({
		token: randomUUID(),
		expiredAt: expiredAt,
		ownerId: userId
	});
	await refreshToken.save();

	return { accessToken, refreshToken: refreshToken.token };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}