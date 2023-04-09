import { BasePath, ConfigsRootPath } from "../../index";
import { Validator } from "../../types";


export const CreateConfigsBasePath = "";

export const CreateConfigsPath = `${BasePath}${ConfigsRootPath}${CreateConfigsBasePath}`;

export const CreateConfigsRequestValidator: Validator<CreateConfigsRequest> = {
	title: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 128 || "Максимальная длина 128 символа"
		],
		required: true
	},
	data: {
		check: [],
		required: true
	},
	carId: {
		check: [value => !!value || "Нужно добавить машину"],
		required: true
	}
};

export const CreateConfigsSettings = {
	minFilesCount: 1,
	maxFilesCount: 40,
	maxFileSize: 104_857_600
};

export type CreateConfigsRequest = {
	title: string,
	data: File[],
	carId: string
}

export type CreateConfigsResponse = {
	config: {
		id: string,
		title: string,
		carId: string,
	}
};
