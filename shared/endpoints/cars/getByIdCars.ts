import { BasePath, CarsRootPath } from "../../index";


export const GetByIdCarsBasePath = "/:id";

export const GetByIdCarsPath = `${BasePath}${CarsRootPath}${GetByIdCarsBasePath}`;

export type GetByIdCarsParams = {
	id: string
}

export type GetByIdCarsResponse = {
	car: {
		id: string,
		name: string
	}
};
