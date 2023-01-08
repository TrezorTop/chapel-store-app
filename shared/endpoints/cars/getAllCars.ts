import { BasePath, CarsRootPath } from "../../index";


export const GetAllCarsBasePath = "";

export const GetAllCarsPath = `${BasePath}${CarsRootPath}${GetAllCarsBasePath}`;

export type GetAllCarsResponse = {
	cars: {
		id: string,
		name: string,
		configs: {
			id: string,
			title: string
		}[]
	}[]
};
