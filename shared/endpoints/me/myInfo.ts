import { Role } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, MeRootPath } from "../../index";


export const GetMyInfoBasePath = "";

export const GetMyInfoPath = `${BasePath}${MeRootPath}${GetMyInfoBasePath}`;

export type GetMyInfoResponse = {
	me: {
		username: string,
		role: Role,
		uncommittedOrders: {
			id: string,
			payUrl: string,
			method: string,
			bundle: {
				name: string
			}
		}
	}
};