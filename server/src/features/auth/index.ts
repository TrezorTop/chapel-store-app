import { Role, User } from "@prisma/client";
import { FastifyPluginAsync } from "fastify/types/plugin";
import { confirmResetPassword } from "./confirmResetPassword";
import { login } from "./login";
import { refresh } from "./refresh";
import { register } from "./register";
import { requestResetPassword } from "./requestResetPassword";
import { deps } from "./services";
import { verifyEmail } from "./verifyEmail";


export const authModule: FastifyPluginAsync = async (instance) => {
	deps.jwt = instance.jwt;

	instance.register(register);
	instance.register(verifyEmail);
	instance.register(login);
	instance.register(refresh);
	instance.register(requestResetPassword);
	instance.register(confirmResetPassword);
};

export type UserJwt = {
	username: User["username"];
	role: Role
};

export type ResetPasswordJwt = {
	username: User["username"];
};