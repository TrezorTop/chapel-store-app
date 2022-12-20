import { BasePath, CarsBasePath } from "../../index";


export const GetAllBasePath = "/";

export const GetAllPath = `${BasePath}${CarsBasePath}${GetAllBasePath}`;

export type GetAllResponse = {
	cars: {
		id: string,
		name: string
	}[]
};
