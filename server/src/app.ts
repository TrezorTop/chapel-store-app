require("dotenv").config();

import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";


import formBody from "@fastify/formbody";
import fastify from "fastify";
import multer from "fastify-multer";
import { FastifyPluginAsync } from "fastify/types/plugin";
import {
	AuthRootPath,
	BasePath,
	BundlesRootPath,
	CarsRootPath,
	ConfigsRootPath,
	HealthRootPath,
	MeRootPath,
	PaymentsRootPath,
	PromocodesRootPath,
	UsersRootPath
} from "../../shared";
import { authModule } from "./features/auth";
import { bundlesModule } from "./features/bundles";
import { carsModule } from "./features/cars";
import { configsModule } from "./features/configs";
import { healthModule } from "./features/health";
import { meModule } from "./features/me";
import { paymentsModule } from "./features/payments";
import { promocodesModule } from "./features/promocodes";
import { usersModule } from "./features/users";
import { setErrorHandler } from "./infrastructure/applicationErrorHandler";
import { jwtConfig } from "./infrastructure/jwtConfig";


const server = fastify();

const routes: FastifyPluginAsync = async (instance) => {
	server.register(cors);
	server.register(fastifyCookie);
	await jwtConfig(server);
	server.register(formBody);
	server.register(multer.contentParser);
	instance.register(authModule, { prefix: AuthRootPath });
	instance.register(usersModule, { prefix: UsersRootPath });
	instance.register(carsModule, { prefix: CarsRootPath });
	instance.register(promocodesModule, { prefix: PromocodesRootPath });
	instance.register(bundlesModule, { prefix: BundlesRootPath });
	instance.register(configsModule, { prefix: ConfigsRootPath });
	instance.register(meModule, { prefix: MeRootPath });
	instance.register(paymentsModule, { prefix: PaymentsRootPath });
	instance.register(healthModule, { prefix: HealthRootPath });
};

const start = async () => {
	try {
		setErrorHandler(server);
		await server.register(routes, { prefix: BasePath });
		await server.listen({ port: 3000 });

		console.log("Listening...");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();