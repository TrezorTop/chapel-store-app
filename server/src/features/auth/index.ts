import { FastifyPluginAsync } from "fastify/types/plugin";
import { login } from "./login";
import { refresh } from "./refresh";
import { register } from "./register";
import { resetPassword } from "./resetPassword";
import { deps } from "./services";


export const authModule: FastifyPluginAsync = async (instance) => {
	deps.jwt = instance.jwt;

	instance.register(register);
	instance.register(login);
	instance.register(refresh);
	instance.register(resetPassword);
};