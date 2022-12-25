import { FastifyPluginAsync } from "fastify/types/plugin";
import { getMyConfigs } from "./getMyConfigs";


export const meModule: FastifyPluginAsync = async (instance) => {
	instance.register(getMyConfigs);
};