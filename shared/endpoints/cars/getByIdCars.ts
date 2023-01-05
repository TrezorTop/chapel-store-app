import { BasePath, BundlesRootPath } from "../../index";


export const GetByIdCarsBasePath = "/:id";

export const GetByIdCarsPath = `${BasePath}${BundlesRootPath}${GetByIdCarsBasePath}`;

export type GetByIdCarsParams = {
	id: string
}

export type GetByIdCarsResponse = {
	car: {
		id: string,
		name: string
	}
};
