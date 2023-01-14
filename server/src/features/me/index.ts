import { FastifyPluginAsync } from "fastify/types/plugin";
import { getMyConfigs } from "./getMyConfigs";
import { myInfo } from "./myInfo";


export const meModule: FastifyPluginAsync = async (instance) => {
	instance.register(getMyConfigs);
	instance.register(myInfo);
};