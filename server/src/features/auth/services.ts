import { FastifyJWT, JWT, SignPayloadType } from "@fastify/jwt";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/prismaConnect";


const saltRounds = 10;
// @ts-ignore
export const deps: {
	jwt: JWT
} = {};

export async function getUserByUsername(username: string) {
	return await prisma.user.findUnique({
		where: {
			username: username
		},
	});
}

export function decodeToken(token: string): FastifyJWT["payload"] {
	return deps.jwt.verify(token);
}


export function generateTokens(username: string, role: Role) {
	const payload: SignPayloadType = {
		username: username,
		role: role
	};

	const accessToken = deps.jwt.sign(payload, { expiresIn: "10m" });
	const rawRefreshToken = deps.jwt.sign(payload, { expiresIn: "30 days" });

	return { accessToken, refreshToken: rawRefreshToken };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}