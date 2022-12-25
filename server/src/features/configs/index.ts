import { FastifyPluginAsync } from "fastify/types/plugin";
import { getAll } from "./getAll";


export const configsModule: FastifyPluginAsync = async (instance) => {
	instance.register(getAll);
};