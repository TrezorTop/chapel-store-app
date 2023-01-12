import { FastifyInstance } from "fastify";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { GetByIdConfigs_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	GetConfigFileBasePath,
	GetConfigFileParams,
	GetConfigFileResponse
} from "../../../../shared/endpoints/configs/getConfigFile";
import { Validator } from "../../../../shared/types";
import { configsPath } from "../../constants";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, findSingleFile } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetConfigFileParams> = {
	name: {
		check: [],
		required: true
	}
};


export const getConfigFile = async (instance: FastifyInstance) => {
	instance.get<{
		Params: GetConfigFileParams,
		Reply: GetConfigFileResponse
	}>(GetConfigFileBasePath, {
		onRequest: [jwtOnRequestHook()],
		preValidation: [validatePreValidationHook({ params: paramsValidator })]
	}, async (request, reply) => {
		const params = request.params;

		const isAdmin = request?.user?.role === "ADMIN";

		const dbFile = await cancelIfFailed(() => prisma.file.findFirst({
			where: {
				name: params.name,
				...(!isAdmin && {
					config: {
						purchases: {
							some: {
								ownerUsername: request.user.username
							}
						}
					}
				})
			},
			select: { configId: true }
		}), StatusCodes.NOT_FOUND, GetByIdConfigs_NotFound);

		const configFolder = path.join(configsPath, dbFile.configId);
		const file = await cancelIfFailed(() => findSingleFile(
				params.name,
				{ cwd: configFolder }
			),
			StatusCodes.BAD_REQUEST, VeryBadThingsHappend
		);
		const stream = fs.createReadStream(path.join(configFolder, file), {
			encoding: "base64"
		});

		return reply.status(StatusCodes.OK).type("application/octet-stream").send(stream as unknown as string);
	});
};