import { Prisma, PrismaClient } from "@prisma/client";


export type JsonValue = Prisma.JsonValue


export const prisma = new PrismaClient();