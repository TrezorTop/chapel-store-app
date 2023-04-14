import { FastifyPluginAsync } from "fastify/types/plugin";
import { getAll } from "./getAll";


export const usersModule: FastifyPluginAsync = async (instance) => {
	instance.register(getAll);
};