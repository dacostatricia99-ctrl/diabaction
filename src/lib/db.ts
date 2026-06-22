import { PrismaClient } from "@prisma/client";

// Singleton Prisma (évite la multiplication des connexions en dev / hot-reload).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * La persistance est-elle activée ?
 * Pilotée par DB_ENABLED pour permettre le repli explicite sur les données de
 * démonstration tant qu'aucune base n'est branchée (voir docker-compose.yml).
 */
export function dbEnabled(): boolean {
  return process.env.DB_ENABLED === "true";
}
