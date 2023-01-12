import { File as DbFile, Role } from "@prisma/client";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { File } from "fastify-multer/lib/interfaces";
import * as fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import {
	CreateConfigs_NotEnoughFiles,
	CreateConfigs_WrongBundleId,
	CreateConfigs_WrongCarId
} from "../../../../shared/consts/error";
import {
	CreateConfigsBasePath,
	CreateConfigsRequest,
	CreateConfigsResponse,
	CreateConfigsSettings
} from "../../../../shared/endpoints/configs/createConfigs";
import { configMulterHandler, configsPath } from "../../constants";
import { ApplicationError } from "../../infrastructure/applicationErrorHandler";
import { jwtOnRequestHook } from "../../infrastructure/jwtConfig";
import { prisma } from "../../infrastructure/prismaConnect";
import { cancelIfFailed, removeTempFiles } from "../../infrastructure/utils";


export const create = async (instance: FastifyInstance) => {
	instance.post<{
		Reply: CreateConfigsResponse,
		Body: CreateConfigsRequest
	}>(CreateConfigsBasePath, {
		preHandler: [configMulterHandler],
		onRequest: [jwtOnRequestHook({ requiredRole: Role.ADMIN })],
		onResponse: [removeTempFiles]
	}, async (request, reply) => {
		const body = request.body;

		await cancelIfFailed(() =>
			prisma.bundle.findUnique({
				where: {
					id: body.bundleId
				}
			}), StatusCodes.NOT_FOUND, CreateConfigs_WrongBundleId
		);
		await cancelIfFailed(() =>
			prisma.car.findUnique({
				where: {
					id: body.carId
				}
			}), StatusCodes.NOT_FOUND, CreateConfigs_WrongCarId
		);

		const id = cuid();
		const created = await prisma.config.create({
			data: {
				id: id,
				title: body.title,
				bundleId: body.bundleId,
				carId: body.carId
			}
		});
		await processFiles(id, request.files);

		return reply.status(StatusCodes.CREATED).send({
			config: created
		});
	});
};

export async function processFiles(id: string, files: Required<File>[]) {
	if (files.length < CreateConfigsSettings.minFilesCount)
		throw new ApplicationError(StatusCodes.BAD_REQUEST, CreateConfigs_NotEnoughFiles, {
			minFilesCount: CreateConfigsSettings.minFilesCount
		});

	const newFiles = await saveFiles(id, files);

	await prisma.file.createMany({
		data: newFiles
	});
}

async function saveFiles(id: string, files: Required<File>[]): Promise<DbFile[]> {
	const uploadPath = path.join(configsPath, id);
	await fs.mkdir(uploadPath);
	const dbFiles: DbFile[] = [];

	files.forEach(file => {
		const fileName = `${cuid()}${path.extname(file.originalname)}`;
		const filePath = path.join(uploadPath, fileName);

		dbFiles.push({
			name: fileName,
			originalName: file.originalname,
			size: String(file.size),
			configId: id
		});

		fs.rename(file.path, filePath);
	});

	return dbFiles;
}