#!/bin/sh
set -e

# Applique les migrations versionnées si la persistance est activée.
if [ "$DB_ENABLED" = "true" ]; then
  echo "→ Application des migrations Prisma…"
  npx prisma migrate deploy
fi

echo "→ Démarrage de Next.js sur le port ${PORT:-3000}…"
exec npm run start
