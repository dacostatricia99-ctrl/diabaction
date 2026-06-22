-- Active PostGIS dès la création de la base (image postgis/postgis).
CREATE EXTENSION IF NOT EXISTS postgis;
-- pgcrypto : gen_random_uuid() et chiffrement applicatif éventuel.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
