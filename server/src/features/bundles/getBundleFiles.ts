import archiver from "archiver";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { GetBundleFiles_NotFound, VeryBadThingsHappend } from "../../../../shared/consts/error";
import {
	GetBundleFilesBasePath,
	GetBundleFilesParams,
	GetBundleFilesResponse
} from "../../../../shared/endpoints/bundles/getBundleFiles";
import { Validator } from "../../../../shared/types";
import { configsPath } from "../../constants";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, findSingleFile, removeTempFiles } from "../../infrastructure/utils";
import { validatePreValidationHook } from "../../infrastructure/validatePreValidationHook";


const paramsValidator: Validator<GetBundleFilesParams> = {
	id: {
		check: [value => cuid.isCuid(value) || "Невалидный id"],
		required: true
	}
};


export const getBundleFiles = async (instance: FastifyInstance) => {
	instance.get<{
		Params: GetBundleFilesParams,
		Reply: GetBundleFilesResponse
	}>(GetBundleFilesBasePath, {
		onRequest: [jwtOnRequestHook()],
		preValidation: [validatePreValidationHook({ params: paramsValidator })],
		onResponse: [removeTempFiles]
	}, async (request, reply) => {
		const params = request.params;

		const isAdmin = request?.user?.role === "ADMIN";

		const dbFiles = await cancelIfFailed(() => prisma.bundle.findFirst({
			where: {
				id: params.id,
				...(!isAdmin && {
					purchases: {
						some: {
							ownerUsername: request.user.username
						}
					}
				})
			},
			include: {
				configs: {
					select: {
						config: {
							select: {
								title: true,
								files: true
							}
						}
					}
				}
			}
		}), StatusCodes.NOT_FOUND, GetBundleFiles_NotFound);

		const archive = archiver("zip", {
			zlib: { level: 9 }, encoding: "binary"
		});
		const downloadTask = reply.status(StatusCodes.OK)
		                          .type("application/octet-stream")
		                          .send(archive as unknown as string);

		for (let configs of dbFiles.configs) {
			const configZipPath = `${configs.config.title}/`;
			archive.directory(configZipPath, configs.config.title);

			for (let file of configs.config.files) {
				const configFolder = path.join(configsPath, file.configId);
				const fileName = await cancelIfFailed(() => findSingleFile(
					file.name,
					{ cwd: configFolder }
				), StatusCodes.BAD_REQUEST, VeryBadThingsHappend);

				archive.file(path.join(configFolder, fileName), { name: path.join(configZipPath, file.originalName) });
			}
		}
		await archive.finalize();

		return downloadTask;
	});
};