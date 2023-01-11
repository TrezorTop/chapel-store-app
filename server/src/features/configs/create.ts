import AdmZip from "adm-zip";
import cuid from "cuid";
import { FastifyInstance } from "fastify";
import { File } from "fastify-multer/lib/interfaces";
import * as fs from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import {
	CreateConfigs_FileIsNotArchive,
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
		onRequest: [jwtOnRequestHook],
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
		await processFiles(id, request.files);
		const created = await prisma.config.create({
			data: {
				id: id,
				title: body.title,
				bundleId: body.bundleId,
				carId: body.carId
			}
		});

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

	if (files.length === 1) {
		const file = files[0];

		if (!isArchive(file.mimetype))
			throw new ApplicationError(StatusCodes.BAD_REQUEST, CreateConfigs_FileIsNotArchive, {
				target: file.filename,
				required: "zip/rar/7z"
			});

		await processAsSingleArchiveFile(id, file);
		return;
	}

	await processAsMultipleFiles(id, files);
}

async function processAsMultipleFiles(id: string, files: Required<File>[]) {
	const zip = new AdmZip();

	files.forEach(file => {
		zip.addLocalFile(file.path, "", file.originalname);
	});

	const uploadPath = path.join(configsPath, `${id}.zip`);
	await zip.writeZipPromise(uploadPath);
}

async function processAsSingleArchiveFile(id: string, file: Required<File>) {
	const ext = path.extname(file.originalname);
	const uploadPath = path.join(configsPath, `${id}${ext}`);

	await fs.rename(file.path, uploadPath);
}

function isArchive(mimeType: string) {
	return mimeType === "application/zip" ||
		mimeType === "application/x-rar" ||
		mimeType === "application/x-7z" ||
		mimeType === "application/x-rar-compressed" ||
		mimeType === "application/x-7z-compressed";
}