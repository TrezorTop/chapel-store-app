import { BasePath, ConfigsRootPath } from "../../index";

export const GetByIdConfigsBasePath = "/:id";

export const GetByIdConfigsPath = `${BasePath}${ConfigsRootPath}${GetByIdConfigsBasePath}`;

export type GetByIdConfigsParams = {
  id: string;
};

export type GetByIdConfigsResponse = {
  config: {
    id: string;
    title: string;
    softDeleted?: boolean;
    bundles: {
      bundle: {
        id: string;
        name: string;
      };
    }[];
    carId: string;
    createdAt: Date;
    updatedAt: Date;
    files: {
      name: string;
      originalName: string;
      size: string;
    }[];
  };
};
