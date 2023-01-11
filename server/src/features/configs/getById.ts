import cuid from "cuid";
import { FastifyInstance } from "fastify";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { GetByIdConfigs_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import { GetByIdConfigsBasePath, GetByIdConfigsParams } from "../../../../shared/endpoints/configs/getById";
import { Validator } from "../../../../shared/types";
import { configsPath } from "../../constants";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, findSingleFile } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetByIdConfigsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};


export const getById = async (instance: FastifyInstance) => {
	instance.get<{
		Params: GetByIdConfigsParams
	}>(GetByIdConfigsBasePath, {
		onRequest: [jwtOnRequestHook],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const isAdmin = request?.user?.role === "ADMIN";

		await cancelIfFailed(() => prisma.config.findFirst({
			where: {
				id: params.id,
				...(!isAdmin && {
					purchases: {
						some: {
							ownerUsername: request.user.username
						}
					}
				})
			}
		}), StatusCodes.NOT_FOUND, GetByIdConfigs_NotFound);

		const file = await cancelIfFailed(() => findSingleFile(
				`${params.id}.**`,
				{ cwd: configsPath }
			),
			StatusCodes.BAD_REQUEST, VeryBadThingsHappend
		);
		const stream = fs.createReadStream(path.join(configsPath, file), {
			encoding: "base64"
		});

		return reply.status(StatusCodes.OK).type("application/octet-stream").send(stream);
	});
};