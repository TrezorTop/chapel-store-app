import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { prisma } from "../../infrastructure/prismaConnect";
import { JwtAccessTokenPayload } from "../types";


const saltRounds = 10;


export async function getUserByUsername(username: string) {
	return await prisma.user.findUnique({
		where: {
			username: username
		},
	});
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

export async function generateTokens(username: string) {
	const payload: JwtAccessTokenPayload = {
		ownerUsername: username
	};

	const accessToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "10m" });
	const rawRefreshToken = jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: "30 days" });

	return { accessToken, refreshToken: rawRefreshToken };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}