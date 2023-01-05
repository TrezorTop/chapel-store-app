import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";
import { CreateCarsRequestValidator } from "./createCars";


export const UpdateCarsBasePath = "/:id";

export const UpdateCarsPath = `${BasePath}${CarsRootPath}${UpdateCarsBasePath}`;

export const UpdateCarsRequestValidator: Validator<UpdateCarsRequest> = {
	name: CreateCarsRequestValidator.name
};

export type UpdateCarsParams = {
	id: string
}

export type UpdateCarsRequest = {
	name: string
}

export type UpdateCarsResponse = {
	car: {
		id: string,
		name: string
	}
};
