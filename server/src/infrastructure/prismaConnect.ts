import { Prisma, PrismaClient } from "@prisma/client";


export type JsonValue = Prisma.JsonValue


export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
	if (params.action === "findMany") {
		params.args.orderBy = [
			{ createdAt: "desc" },
			{ id: "desc" },
			(params.args.orderBy && params.args.orderBy)
		];
	}
	return next(params);
});