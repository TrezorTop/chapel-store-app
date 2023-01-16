import { JWT } from "@fastify/jwt";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/prismaConnect";
import { UserJwt } from "./index";


const saltRounds = 10;
// @ts-ignore
export const deps: {
	jwt: JWT
} = {};

export async function getUserByUsername(username: string) {
	return await prisma.user.findFirst({
		where: {
			OR: [
				{
					username: username
				},
				{
					email: username
				}
			],
		},
	});
}

export function decodeToken<T>(token: string): T {
	return deps.jwt.verify(token) as T;
}

export function generateNumberToken() {
	return Math.floor(Math.random() * 899999 + 100000);
}

export function generateTokens(username: string, role: Role) {
	const payload: UserJwt = {
		username: username,
		role: role
	};

	const accessToken = deps.jwt.sign(payload, { expiresIn: "10s" });
	const rawRefreshToken = deps.jwt.sign(payload, { expiresIn: "30 days" });

	return { accessToken, refreshToken: rawRefreshToken };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}