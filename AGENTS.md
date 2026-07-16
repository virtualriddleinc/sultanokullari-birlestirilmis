<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Next.js 16 (App Router) + Payload CMS 3 + PostgreSQL. Public site + `/admin` panel. Standard commands live in `package.json` and `docs/payload-kurulum.md`; only non-obvious cloud caveats are noted here.

- **PostgreSQL must be started on each VM boot** — it is a system dependency installed into the snapshot, not started by the update script (which only runs `npm install`). Start it with: `sudo pg_ctlcluster 16 main start`. Verify: `pg_lsclusters`.
- DB is already provisioned in the snapshot: database `sultanokullari`, role `payload` / password `payload` (matches `docker-compose.yml`). Connection: `postgres://payload:payload@127.0.0.1:5432/sultanokullari`.
- `.env.local` (git-ignored) is already created and persists in the snapshot with `DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `SITE_URL`. `src/lib/env.ts` aborts startup if `PAYLOAD_SECRET`/`DATABASE_URL` are missing.
- Apply schema changes with `npm run payload migrate` (migrations already applied in the snapshot → 67 tables). Dev server: `npm run dev` (webpack, port 5001); admin at `http://localhost:5001/admin`.
- A first admin already exists in the local DB: `admin@sultanokullari.com` / `Admin12345!`.
- `next-env.d.ts` is generated on the first `next dev`/`build`; `npm run typecheck` fails with "Cannot find module '@/images/*'" until then (run dev or build once first).
- Known pre-existing issues (not environment problems): `npm run seed:homepage`/`seed:all` fail on a NOT NULL constraint (`ana_sayfa.mission_tagline`); `npm run lint` reports existing errors/warnings. The CMS runs fine without seeding.
