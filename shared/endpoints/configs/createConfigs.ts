import { BasePath, ConfigsRootPath } from "../../index";
import { Validator } from "../../types";


export const CreateConfigsBasePath = "";

export const CreateConfigsPath = `${BasePath}${ConfigsRootPath}${CreateConfigsBasePath}`;

export const CreateConfigsRequestValidator: Validator<CreateConfigsRequest> = {
	title: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 32 || "Максимальная длина 32 символа"
		],
		required: true
	},
	data: {
		check: [],
		required: true
	},
	carId: {
		check: [],
		required: true
	},
	bundleId: {
		check: [],
		required: true
	}
};

export const CreateConfigsSettings = {
	minFilesCount: 1,
	maxFilesCount: 10,
	maxFileSize: 10_485_760
};

export type CreateConfigsRequest = {
	title: string,
	data: File[],
	carId: string,
	bundleId: string
}

export type CreateConfigsResponse = {
	config: {
		id: string,
		title: string,
		carId: string,
		bundleId: string
	}
};
