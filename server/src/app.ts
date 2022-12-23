require("dotenv").config();

import cors from "@fastify/cors";
import fastify from "fastify";
import { FastifyPluginAsync } from "fastify/types/plugin";
import {
	AuthRootPath,
	BasePath,
	BundlesRootPath,
	CarsRootPath,
	ConfigsRootPath,
	HealthRootPath,
	PaymentsRootPath
} from "../../shared";
import authModule from "./features/auth";
import bundlesModule from "./features/bundles";
import carsModule from "./features/cars";
import configsModule from "./features/configs";
import healthModule from "./features/health";
import paymentsModule from "./features/payments";
import { setErrorHandler } from "./infrastructure/applicationErrorHandler";
import jwtConfig from "./infrastructure/jwtConfig";


const server = fastify();

const routes: FastifyPluginAsync = async (instance) => {
	await jwtConfig(server);
	await server.register(cors);
	await instance.register(authModule, { prefix: AuthRootPath });
	await instance.register(carsModule, { prefix: CarsRootPath });
	await instance.register(bundlesModule, { prefix: BundlesRootPath });
	await instance.register(configsModule, { prefix: ConfigsRootPath });
	await instance.register(paymentsModule, { prefix: PaymentsRootPath });
	await instance.register(healthModule, { prefix: HealthRootPath });
};

async function start() {
	try {
		setErrorHandler(server);
		await server.register(routes, { prefix: BasePath });
		await server.listen({ port: 3000 });

		console.log("Listening...");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

start();