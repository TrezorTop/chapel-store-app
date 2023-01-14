import { Prisma, PrismaClient, Role as PrismaRole } from "@prisma/client";


export type Decimal = Prisma.Decimal

export type Role = PrismaRole

export const prisma = new PrismaClient();