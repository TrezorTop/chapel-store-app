import { FastifyPluginAsync } from "fastify/types/plugin";
import { checkMyPayments } from "./checkMyPayments";
import { deleteUncommittedOrder } from "./deleteUncommittedOrder";
import { getMyBundles } from "./getMyBundles";
import { myInfo } from "./myInfo";


export const meModule: FastifyPluginAsync = async (instance) => {
	instance.register(getMyBundles);
	instance.register(myInfo);
	instance.register(checkMyPayments);
	instance.register(deleteUncommittedOrder);
};