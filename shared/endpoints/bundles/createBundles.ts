import exp from "constants";
import { BasePath, BundlesRootPath } from "../..";
import { Decimal } from "../../../server/src/infrastructure/prismaConnect";
import { Validator } from "../../types";

export const CreateBundlesBasePath = "";

export const CreateBundlesPath = `${BasePath}${BundlesRootPath}${CreateBundlesBasePath}`;

export const CreateBundlesRequestValidator: Validator<CreateBundlesRequest> = {
  name: {
    check: [
      (value) => value.length >= 1 || "Минимальная длина 1 символ",
      (value) => value.length <= 128 || "Максимальная длина 128 символа",
    ],
    required: true,
  },
  price: {
    check: [(value) => value >= 1 || "Минимальная цена 1 единица"],
    required: true,
  },
  configs: {
    check: [],
    required: true,
  },
};

export type CreateBundlesRequest = {
  name: string;
  price: number;
  configs: string[];
};

export type CreateBundlesResponse = {
  bundle: {
    id: string;
    name: string;
    price: Decimal;
  };
};

export enum BundleTypeEnum {
  SINGLE = "SINGLE",
  FULLSET = "FULL SET",
}
