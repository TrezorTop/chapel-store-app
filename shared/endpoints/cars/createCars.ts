import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";


export const CreateCarsBasePath = "";

export const CreateCarsPath = `${BasePath}${CarsRootPath}${CreateCarsBasePath}`;

export const CreateCarsRequestValidator: Validator<CreateCarsRequest> = {
	name: {
		check: [
			value => value.length >= 1 || "Минимальная длина 1 символ",
			value => value.length <= 32 || "Максимальная длина 32 символа"
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
