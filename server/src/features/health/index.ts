import { FastifyPluginAsync } from "fastify/types/plugin";
import { ping } from "./ping";


export const healthModule: FastifyPluginAsync = async (instance) => {
	instance.register(ping);
};