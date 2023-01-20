import { BasePath, MeRootPath } from "../../index";


export const DeleteUncommittedOrderBasePath = "/:id";

export const DeleteUncommittedOrderPath = `${BasePath}${MeRootPath}${DeleteUncommittedOrderBasePath}`;

export type DeleteUncommittedOrderParams = {
	id: string
}

export type DeleteUncommittedOrderResponse = {};
