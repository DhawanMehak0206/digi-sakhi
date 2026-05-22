# Migrations

This app uses Supabase Postgres. SQL migrations are stored here for convenience.

## Apply

1. Create a Supabase project (or run Supabase locally).
2. Open the SQL Editor and run `src/migrations/001_init_public_all_open.sql`.

## Security warning

`001_init_public_all_open.sql` enables **full public read/write** (including anon inserts/updates/deletes) on all app tables via permissive RLS policies. Use only for demos/prototyping.

