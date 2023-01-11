import multer from "fastify-multer";
import * as fs from "fs";
import path from "node:path";
import { CreateConfigsSettings } from "../../shared/endpoints/configs/createConfigs";


export const tmpFolder = path.join(path.parse(process.cwd()).root, "tmp");
if (!fs.existsSync(tmpFolder)) {
	fs.mkdirSync(tmpFolder);
}

export const configsPath = process.env.CONFIGS_DISK_PATH!;
if (!fs.existsSync(configsPath)) {
	fs.mkdirSync(configsPath);
}


export const configMulterHandler = multer({
	dest: tmpFolder,
	limits: {
		fileSize: CreateConfigsSettings.maxFileSize,
	}
})
.array("data", CreateConfigsSettings.maxFilesCount);