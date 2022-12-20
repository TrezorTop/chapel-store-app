import { AuthBasePath, BasePath } from "../../index";


export const RefreshBasePath = "/refresh";

export const RefreshPath = `${BasePath}${AuthBasePath}${RefreshBasePath}`;

export type RefreshRequest = {
	refreshToken: string
};

export type RefreshResponse = {
	accessToken: string;
	refreshToken: string;
};
