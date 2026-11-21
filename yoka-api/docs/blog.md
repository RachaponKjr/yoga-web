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

## SEO, editor and analytics

Apply the additive `20261121000000_blog_seo_views` migration and regenerate Prisma Client before deploying this update. Existing posts keep their content and use title/excerpt fallbacks. As above, baseline legacy migration history first; never reset production.

The admin uses `@uiw/react-md-editor` with formatting tools and the same safe Markdown preview as the public site. Existing plain text remains plain until edited; Markdown retains the version marker. Raw HTML is never rendered.

Editable SEO fields: `seoTitle`, `seoDescription`, `seoKeywords` (comma separated), `canonicalUrl`, `noIndex`, `coverAlt`, `author`. Cover image supplies Open Graph/Twitter imagery. Public pages emit article metadata and escaped BlogPosting JSON-LD. Sitemap excludes noindex and externally canonicalized articles (up to one hour cache).

Admin listing supports `status=all|published|draft` and `sort=recent|popular`. Public listing never exposes drafts regardless of status query.

`POST /:slug/view` counts published article visits, using an HttpOnly cookie to suppress repeats for 30 minutes. The reader sends the event after 1.5 seconds on a visible page. GET, metadata and prefetch requests never count. Increment is atomic and does not alter article modification dates. This is an approximate visit counter, not unique people or bot-proof analytics; cleared/blocked cookies, parallel initial requests and automated calls may inflate counts.
