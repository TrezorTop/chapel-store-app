import { Prisma, PrismaClient } from "@prisma/client";


export type JsonValue = Prisma.JsonValue


export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
	if (params.action === "findMany") {
		console.log(42);
	}
	return next(params);
});