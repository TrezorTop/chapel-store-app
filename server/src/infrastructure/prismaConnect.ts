import { PaymentMethod as PrismaPaymentMethod, Prisma, PrismaClient, Role as PrismaRole } from "@prisma/client";


export type Decimal = Prisma.Decimal

export type Role = PrismaRole
export const PaymentMethod = PrismaPaymentMethod;
export type PaymentMethod = PrismaPaymentMethod

export const prisma = new PrismaClient();