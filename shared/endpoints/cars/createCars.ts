import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";


export const CreateCarsBasePath = "";

export const CreateCarsPath = `${BasePath}${CarsRootPath}${CreateCarsBasePath}`;

export const CreateCarsRequestValidator: Validator<CreateCarsRequest> = {
	name: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 128 || "Максимальная длина 128 символа"
		],
		required: true
	}
};

export type CreateCarsRequest = {
	name: string
}

export type CreateCarsResponse = {
	car: {
		id: string,
		name: string
	}
};
