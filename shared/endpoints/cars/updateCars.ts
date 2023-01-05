import { BasePath, CarsRootPath } from "../../index";
import { Validator } from "../../types";
import { makeOptionalValidator } from "../../utils";
import { CreateCarsRequestValidator } from "./createCars";


export const UpdateCarsBasePath = "/:id";

export const UpdateCarsPath = `${BasePath}${CarsRootPath}${UpdateCarsBasePath}`;

export const UpdateCarsRequestValidator: Validator<UpdateCarsRequest> = makeOptionalValidator(CreateCarsRequestValidator);

export type UpdateCarsParams = {
	id: string
}

export type UpdateCarsRequest = {
	name?: string
}

export type UpdateCarsResponse = {
	car: {
		id: string,
		name: string
	}
};
