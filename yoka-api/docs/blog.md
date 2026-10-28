# Blog

- Public website: `/blog` and `/blog/:slug`.
- Admin dashboard: `/blog` (existing Admin sign-in required).
- Create/edit: title, unique English slug, excerpt, plain-text content, optional cover URL/upload, and draft/published state.
- Blank lines separate paragraphs. Text is escaped by React; HTML is not executed.
- Covers support JPG, PNG, WebP up to 5 MB. Preserve the existing `uploads` directory/volume when deploying. Removing a cover or deleting a post does not delete the stored image, since images may be reused.
- Public pages fetch fresh data on each request; publishing, unpublishing, editing, and deleting take effect without rebuilding the frontend.

## Database setup

The additive migration is `prisma/migrations/20261028000000_add_blog/migration.sql`. Generate Prisma Client after updating the schema. Apply the migration to the target database using its established deployment process before starting the updated API.

The repository's historical initial migration does not match the current full schema. Do not reset an existing database to resolve that drift. Reconcile/baseline migration history before using `prisma migrate deploy` on an existing installation. The Blog migration only creates the new BlogPost table and its indexes.

Local development uses the dedicated `yoka_local` database; `pnpm dev` at the repository root starts it, generates Prisma Client, and synchronizes the schema. No production database is changed by this workflow.

## API (`/api/v1/blog`)

| Method | Path | Access |
| --- | --- | --- |
| GET | `/` | Public, published only; page, limit, search |
| GET | `/:slug` | Public, published only; 404 for drafts/deleted |
| GET | `/admin` | Admin, all statuses; page, limit, search |
| GET | `/admin/:id` | Admin, full editable content |
| POST | `/` | Admin, create |
| PUT | `/:id` | Admin, replace editable fields |
| DELETE | `/:id` | Admin, permanent delete |
| POST | `/upload` | Admin, multipart field `image` |

Write payload: `{ title, slug, excerpt, content, coverImage, published }`.
Slugs use lowercase Latin letters, numbers and hyphens; `admin` and `upload` are reserved. Duplicate slugs return 409; invalid input returns 400; missing records return 404. Public list responses omit full article content and include pagination metadata.

## Verification

From `yoka-api`, run `node scripts/test-blog.cjs` with the local database running. The test explicitly targets the dedicated local database, creates temporary posts, tests CRUD, publication visibility, permissions, validation and image uploads, then cleans up its own data. It does not require an existing admin account.
