import { FastifyJWT, JWT, SignPayloadType } from "@fastify/jwt";
import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/prismaConnect";


const saltRounds = 10;


export function initializeServices(jwt: JWT) {
	return {
		getUserByUsername: async function (username: string) {
			return await prisma.user.findUnique({
				where: {
					username: username
				},
			});
		},
		decodeToken: function (token: string): FastifyJWT["payload"] {
			return jwt.verify(token);
		},
		generateTokens: function (username: string) {
			const payload: SignPayloadType = {
				username: username
			};

			const accessToken = jwt.sign(payload, { expiresIn: "10m" });
			const rawRefreshToken = jwt.sign(payload, { expiresIn: "30 days" });

			return { accessToken, refreshToken: rawRefreshToken };
		},
		hashPassword: async function (password: string) {
			return await bcrypt.hash(password, saltRounds);
		},
		comparePassword: async function (password: string, hash: string) {
			return await bcrypt.compare(password, hash);
		}
	};
}