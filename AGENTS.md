<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Product: a single Next.js 16 + Payload CMS 3 app ("Sultan Okulları") serving the public Turkish website and the `/admin` CMS from one process. Standard commands live in `package.json` scripts and `docs/payload-kurulum.md`. Two services are needed: **PostgreSQL 16** and the **Next.js/Payload dev server**.

- **PostgreSQL is not auto-started.** It is a local apt cluster (not Docker). Start it with `sudo pg_ctlcluster 16 main start`. Connection: `postgres://payload:payload@127.0.0.1:5432/sultanokullari`.
- **`.env.local` is required and gitignored** (baked into the VM snapshot). It must define `PAYLOAD_SECRET` (≥16 chars), `DATABASE_URL`, and — for live preview — `PREVIEW_SECRET` and `NEXT_PUBLIC_SERVER_URL=http://localhost:5001`. Without `PAYLOAD_SECRET`/`DATABASE_URL` the process refuses to boot (`src/lib/env.ts`).
- **Run dev:** `npm run dev` → site at `http://localhost:5001`, admin at `http://localhost:5001/admin`. Payload initializes lazily on the first request (first hit can take ~15s to compile).
- **`npm install` needs `--legacy-peer-deps`.** The lockfile pins `graphql@17` but Payload's peer wants v16; GraphQL is disabled by default so this is safe. Plain `npm install`/`npm ci` fail with ERESOLVE.
- **The DB schema is already provisioned in the snapshot and was built via Payload schema push, not migrations. Do NOT run `npm run payload migrate` against the existing DB** — the committed migrations are not cleanly reproducible on a fresh DB (a duplicate-constraint idempotency bug in `20260628_191000_staff_locked_docs_rels`, and later migrations reference version tables like `_pages_v` that no migration creates). To rebuild the schema from scratch: temporarily set `push: true` in `src/payload.config.ts` (`db.postgresAdapter`), drop/recreate the `sultanokullari` DB, boot `npm run dev` and hit any route to push the schema, then revert `push` to `false` (do not commit the change).
- **First admin user gotcha:** the create-first-user form defaults the "Roller" field to "Editör". Editors are draft-only (`restrictEditorPublish`), so a first user left as Editor cannot publish. Select "Yönetici", or promote via DB (`UPDATE users_roles SET value='admin' WHERE parent_id=<id>;`) and re-login to refresh the JWT. A dev admin already exists: `admin@sultanokullari.com` / `Sultan2026!`.
- `npm run seed:all` currently fails on hero-slides validation (repo seed-data issue) and is not required to run the app. `npm run cms:health` and `npm run check:importmap` are useful sanity checks.
- Lint (`npm run lint`) has pre-existing errors in the repo; `npm run typecheck` passes clean.
