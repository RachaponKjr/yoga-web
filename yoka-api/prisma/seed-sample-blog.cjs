// This seed is intentionally restricted to the dedicated local development DB.
const { PrismaClient } = require('@prisma/client');
const payload = require('./fixtures/sample-blog.json');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://yoka:yoka_local@127.0.0.1:55432/yoka_local?schema=public' } } });
(async () => {
  const existing = await prisma.blogPost.findUnique({ where: { slug: payload.slug } });
  const post = existing || await prisma.blogPost.create({ data: { ...payload, publishedAt: new Date() } });
  console.log(JSON.stringify({ created: !existing, title: post.title, slug: post.slug, published: post.published }));
})().catch(() => { console.error('Could not seed the local sample blog. Check the local database is running and its schema is up to date.'); process.exitCode = 1; }).finally(() => prisma.$disconnect());
