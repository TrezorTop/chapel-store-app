import { BasePath, CarsRootPath } from "../../index";


export const CarsBasePath = "";

export const CarsPath = `${BasePath}${CarsRootPath}${CarsBasePath}`;

export type CarsResponse = {
	cars: {
		id: string,
		name: string
	}[]
};
