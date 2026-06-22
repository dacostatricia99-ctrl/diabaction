import { PrismaClient } from "@prisma/client";

// Singleton Prisma instancié **paresseusement** : le client n'est créé qu'au
// premier accès réel (première requête). Conséquences :
//  - en mode démo (DB_ENABLED=false), Prisma n'est jamais instancié ;
//  - pendant `next build` (collecte des pages), aucun accès → pas besoin de
//    DATABASE_URL au build (sinon échec « Failed to collect page data »).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

// Proxy transparent : `prisma.center.findMany(...)` etc. fonctionnent comme avant,
// mais l'instanciation est différée jusqu'au premier accès de propriété.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * La persistance est-elle activée ?
 * Pilotée par DB_ENABLED pour permettre le repli explicite sur les données de
 * démonstration tant qu'aucune base n'est branchée (voir docker-compose.yml).
 */
export function dbEnabled(): boolean {
  return process.env.DB_ENABLED === "true";
}
