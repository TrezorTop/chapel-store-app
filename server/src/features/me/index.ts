import { FastifyPluginAsync } from "fastify/types/plugin";
import { getMyConfigById } from "./getMyConfigById";
import { getMyConfigs } from "./getMyConfigs";


export const meModule: FastifyPluginAsync = async (instance) => {
	instance.register(getMyConfigs);
	instance.register(getMyConfigById);
};