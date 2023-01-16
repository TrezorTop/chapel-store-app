import { BasePath, MeRootPath } from "../../index";


export const CheckMyPaymentsBasePath = "/payments";

export const CheckMyPaymentsPath = `${BasePath}${MeRootPath}${CheckMyPaymentsBasePath}`;

export type CheckMyPaymentsResponse = {};