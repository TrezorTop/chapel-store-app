import { FastifyPluginAsync } from "fastify/types/plugin";
import { create } from "./create";
import { getAll } from "./getAll";


export const configsModule: FastifyPluginAsync = async (instance) => {
	instance.register(getAll);
	instance.register(create);
};