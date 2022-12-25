import { FastifyPluginAsync } from "fastify/types/plugin";
import { create } from "./create";


export const paymentsModule: FastifyPluginAsync = async (instance) => {
	instance.register(create);
};