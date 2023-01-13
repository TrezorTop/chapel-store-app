import { Prisma, PrismaClient } from "@prisma/client";


export type Decimal = Prisma.Decimal

export const prisma = new PrismaClient();