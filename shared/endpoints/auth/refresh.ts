import { AuthRootPath, BasePath } from "../../index";


export const RefreshBasePath = "/refresh";

export const RefreshPath = `${BasePath}${AuthRootPath}${RefreshBasePath}`;

export type RefreshRequest = {
	refreshToken: string
};

export type RefreshResponse = {
	accessToken: string;
	refreshToken: string;
};
