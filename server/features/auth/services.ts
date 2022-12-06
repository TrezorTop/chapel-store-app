import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import RefreshToken from "../../domain/RefreshToken";
import User from "../../domain/User";
import { JwtAccessTokenPayload } from "../types";


const saltRounds = 10;


export async function getUserByUsername(username: string) {
	return await User.findOne({ username: username }).exec();
}

export function decodeToken(token: string) {
	let payload: JwtAccessTokenPayload;

	try {
		payload = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtAccessTokenPayload;
	} catch (e) {
		return null;
	}

	return payload;
}

export async function generateTokens(username: string, userId: string) {
	const payload: JwtAccessTokenPayload = {
		owner: username
	};

	const accessToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "10m" });
	const rawRefreshToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "30 days" });

	const refreshToken = new RefreshToken({
		token: rawRefreshToken,
		ownerId: userId
	});
	await refreshToken.save();

	return { accessToken, refreshToken: rawRefreshToken };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}