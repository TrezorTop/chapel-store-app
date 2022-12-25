import { FastifyPluginAsync } from "fastify/types/plugin";
import { deleteById } from "./deleteById";
import { getAll } from "./getAll";


export const bundlesModule: FastifyPluginAsync = async (instance) => {
	instance.register(getAll);
	instance.register(deleteById);
};