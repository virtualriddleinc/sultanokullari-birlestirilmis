# Local Admin Test Results

Date: 2026-07-14

## Environment

- Base URL: `http://localhost:5001`
- Database: `postgresql://payload:payload@127.0.0.1:5432/payload`
- Server: `npm run dev` in tmux session `payload-dev-server`

## Schema stabilization

- Applied/verified `20260714_130000_schema_drift_smoke_fix` and follow-up local schema migrations in `payload_migrations`.
- Confirmed missing nested/junction tables exist: `news_faq_items`, `events_faq_items`, `pages_story_rows`, `media_tags`, `ana_sayfa_yemekhane_section_paragraphs`.
- Confirmed scalar/version gaps needed by API and draft writes: `site_ayarlari.default_og_image_id`, `staff.academic_title`, page/news/event SEO columns, draft version columns, and version FAQ/story/gallery tables.
- Confirmed `enum_users_roles` contains `admin`, `editor`, `inbox`; users 2 and 3 are `editor` and `inbox`.

## API smoke

- Admin login succeeded.
- Admin JWT GET smoke returned `200` for: `hero-slides`, `journey-chapters`, `news`, `events`, `pages`, `media`, `staff`, `contact-messages`, `ik-applications`, `globals/ana-sayfa`, `globals/site-ayarlari`, `globals/navigation`.

## Privilege smoke

- `BASE=http://localhost:5001 npx tsx src/scripts/security-privilege-check.ts`
- Result: `10` passed, `0` failed.
- Covered: admin/editor/inbox login, inbox denied hero create, inbox limited to self in users, inbox denied admin escalation, inbox denied news update, editor denied navigation update, editor denied role escalation, admin can read navigation.
