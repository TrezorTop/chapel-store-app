import { FastifyPluginAsync } from "fastify/types/plugin";
import { apply } from "./apply";
import { create } from "./create";
import { getAll } from "./getAll";
import { update } from "./update";


export const promocodesModule: FastifyPluginAsync = async (instance) => {
	instance.register(create);
	instance.register(update);
	instance.register(getAll);
	instance.register(apply);
};