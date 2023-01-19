import { BundleType, Decimal, Role } from "../../../server/src/infrastructure/prismaConnect";
import { BasePath, BundlesRootPath } from "../../index";


export const GetAllBundlesBasePath = "";

export const GetAllBundlesPath = `${BasePath}${BundlesRootPath}${GetAllBundlesBasePath}`;

export type GetAllBundlesQuery = {
  carId?: string;
  type?: BundleType,
  role?: Role
};

export type GetAllBundlesResponse = {
  bundles: {
    id: string;
    name: string;
    price: Decimal;
    type: BundleType,
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
