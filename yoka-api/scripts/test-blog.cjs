// Run only against the dedicated local development database; never production.
process.env.DATABASE_URL = 'postgresql://yoka:yoka_local@127.0.0.1:55432/yoka_local?schema=public';
process.env.JWT_SECRET = 'blog-integration-test-only';
process.env.NODE_ENV = 'test';
require('ts-node/register');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { unlink } = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const prisma = require('../src/config/prisma').default;
const router = require('../src/routes/blog.route').default;
const { ZodError } = require('zod');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/blog', router);
app.use((error, req, res, next) => res.status(error instanceof ZodError ? 400 : error.statusCode || 500).json({ message: error.message }));

async function main() {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = role => jwt.sign({ id: 'blog-test', role }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const ids = [];
  let uploaded;
  async function request(method, url, body, role) {
    const response = await fetch(`${base}/blog${url}`, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(role ? { Authorization: `Bearer ${token(role)}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  }
  const payload = { title: 'Blog integration test', slug: `integration-${Date.now()}`, excerpt: 'Test excerpt', content: 'First paragraph\n\nSecond paragraph', coverImage: '', published: false };
  try {
    assert.equal((await request('GET', '/admin')).status, 401);
    assert.equal((await request('GET', '/admin', undefined, 'Student')).status, 403);
    for (const role of [undefined, 'Student', 'Instructor']) {
      assert.equal((await request('POST', '/', payload, role)).status, role ? 403 : 401);
      assert.equal((await request('PUT', '/missing', payload, role)).status, role ? 403 : 401);
      assert.equal((await request('DELETE', '/missing', undefined, role)).status, role ? 403 : 401);
    }
    assert.equal((await request('POST', '/', { ...payload, title: ' ' }, 'Admin')).status, 400);
    assert.equal((await request('POST', '/', { ...payload, coverImage: 'javascript:alert(1)' }, 'Admin')).status, 400);
    assert.equal((await request('POST', '/', { ...payload, slug: 'admin' }, 'Admin')).status, 400);
    assert.equal((await request('GET', '/?page=0')).status, 400);
    const created = await request('POST', '/', payload, 'Admin');
    assert.equal(created.status, 201); const id = created.body.data.id; ids.push(id);
    assert.equal(created.body.data.publishedAt, null);
    assert.equal((await request('GET', `/${payload.slug}`)).status, 404);
    assert.equal((await request('GET', '/?search=Blog%20integration%20test')).body.data.some(item => item.id === id), false);
    assert.equal((await request('GET', '/admin?search=Blog%20integration%20test', undefined, 'Admin')).body.data.some(item => item.id === id), true);
    assert.equal((await request('GET', `/admin/${id}`, undefined, 'Admin')).body.data.content, payload.content);
    assert.equal((await request('POST', '/', payload, 'Admin')).status, 409);
    const published = await request('PUT', `/${id}`, { ...payload, published: true }, 'Admin');
    assert.equal(published.status, 200); assert.ok(published.body.data.publishedAt);
    assert.equal((await request('GET', `/${payload.slug}`)).status, 200);
    const listing = await request('GET', '/?search=Blog%20integration%20test&limit=1');
    assert.equal(listing.body.data[0].id, id); assert.equal(listing.body.data[0].content, undefined);
    const renamed = { ...payload, slug: `${payload.slug}-edited`, title: 'Edited title', published: true };
    assert.equal((await request('PUT', `/${id}`, renamed, 'Admin')).body.data.publishedAt, published.body.data.publishedAt);
    assert.equal((await request('GET', `/${payload.slug}`)).status, 404);
    assert.equal((await request('GET', `/${renamed.slug}`)).body.data.title, 'Edited title');
    assert.equal((await request('PUT', `/${id}`, { ...renamed, published: false }, 'Admin')).status, 200);
    assert.equal((await request('GET', `/${renamed.slug}`)).status, 404);
    assert.equal((await request('DELETE', `/${id}`, undefined, 'Admin')).status, 204);
    assert.equal((await request('GET', `/admin/${id}`, undefined, 'Admin')).status, 404);
    assert.equal((await request('DELETE', `/${id}`, undefined, 'Admin')).status, 404);
    assert.equal((await request('PUT', '/missing', payload, 'Admin')).status, 404);
    const invalid = new FormData(); invalid.append('image', new Blob(['<svg></svg>'], { type: 'image/png' }), 'fake.png');
    assert.equal((await fetch(`${base}/blog/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token('Admin')}` }, body: invalid })).status, 400);
    const valid = new FormData(); valid.append('image', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jF9sAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'test.png');
    const image = await fetch(`${base}/blog/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token('Admin')}` }, body: valid });
    assert.equal(image.status, 201); uploaded = (await image.json()).data.url;
    console.log('PASS: CRUD, drafts, publishing, search/pagination, duplicate slugs, validation, upload, and Admin-only permissions.');
  } finally {
    await prisma.blogPost.deleteMany({ where: { id: { in: ids } } });
    if (uploaded) await unlink(path.join(process.cwd(), uploaded));
    await prisma.$disconnect();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
