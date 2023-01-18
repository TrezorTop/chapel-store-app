import { Decimal, Role } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, BundlesRootPath } from "../../index";


export const GetAllBundlesBasePath = "";

export const GetAllBundlesPath = `${BasePath}${BundlesRootPath}${GetAllBundlesBasePath}`;

export type GetAllBundlesQuery = {
  carId?: string;
  role?: Role
};

export type GetAllBundlesResponse = {
  bundles: {
    id: string;
    name: string;
    price: Decimal;
    softDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    configs: {
      config: {
        id: string;
        title: string;
      };
    }[];
  }[];
};
