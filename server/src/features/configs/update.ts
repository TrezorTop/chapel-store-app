import { Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { UpdateConfigs_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	UpdateConfigsBasePath,
	UpdateConfigsParams,
	UpdateConfigsRequest,
	UpdateConfigsRequestValidator,
	UpdateConfigsResponse
} from "../../../../shared/endpoints/configs/updateConfigs";
import { Validator } from "../../../../shared/types";
import { configMulterHandler, configsPath } from "../../constants";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, findSingleFile, removeTempFiles } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";
import { processFiles } from "./create";


const paramsValidator: Validator<UpdateConfigsParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};

export const update = async (instance: FastifyInstance) => {
	instance.put<{
		Reply: UpdateConfigsResponse,
		Body: UpdateConfigsRequest,
		Params: UpdateConfigsParams
	}>(UpdateConfigsBasePath, {
		preHandler: [configMulterHandler],
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		preValidation: [validatePreValidationHook({ body: UpdateConfigsRequestValidator, params: paramsValidator })],
		onResponse: [removeTempFiles]
	}, async (request, reply) => {
		const body = request.body;
		const params = request.params;

		await cancelIfFailed(() => prisma.config.findUnique({
				where: {
					id: params.id
				}
			}), StatusCodes.NOT_FOUND, UpdateConfigs_NotFound
		);

		if (request.files.length > 0) {
			const file = await cancelIfFailed(() => findSingleFile(
					`${params.id}.**`,
					{ cwd: configsPath }
				),
				StatusCodes.BAD_REQUEST, VeryBadThingsHappend
			);

			const oldPath = path.join(configsPath, file);
			const tempPath = path.join(configsPath, `${file}.old`);
			await fs.rename(oldPath, tempPath);

			try {
				await processFiles(params.id, request.files);
			} catch (e) {
				await fs.rename(tempPath, oldPath);
				throw e;
			}
			await fs.rm(tempPath);
		}

		const updated = await prisma.config.update({
			where: {
				id: params.id
			},
			data: {
				title: body.title,
				softDeleted: body?.softDeleted === "true",
				carId: body.carId,
				bundleId: body.bundleId
			}
		});

		return reply.status(StatusCodes.OK).send({
			config: updated
		});
	});
};
