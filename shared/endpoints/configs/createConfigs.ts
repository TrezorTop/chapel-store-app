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
		check: [
			value => {
				try {
					JSON.parse(value);
				} catch (e) {
					return "Невалидный json";
				}

				return true;
			}
		],
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

export type CreateConfigsRequest = {
	title: string,
	data: string,
	carId: string,
	bundleId: string
}

export type CreateConfigsResponse = {
	config: {
		id: string,
		title: string,
		data: string,
		carId: string,
		bundleId: string
	}
};
