const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
require('ts-node/register/transpile-only');

// Exercise real routing, auth, multipart parsing, controller and service with an
// isolated repository double: tests must never connect to the configured DB.
let record = null;
const prismaPath = require.resolve('@prisma/client');
require.cache[prismaPath] = { id: prismaPath, filename: prismaPath, loaded: true, exports: {
  PrismaClient: class { videoPerview = {
    findFirst: async () => record,
    create: async ({ data }) => (record = { id: 'test-content', ...data }),
    update: async ({ where, data }) => {
      if (!record || where.id !== record.id) throw Object.assign(new Error('missing'), { code: 'P2025' });
      return record = { ...record, ...data };
    },
  }; },
}};
process.env.JWT_SECRET = 'isolated-video-test';
const express = require('express');
const jwt = require('jsonwebtoken');
const routes = require('../src/routes/video.routes').default;
const { config } = require('../src/config/env');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=', 'base64');

test('video content HTTP lifecycle', async (t) => {
  const oldCwd = process.cwd();
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'yoka-video-test-'));
  process.chdir(temp);
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.cookies = {}; next(); });
  app.use('/video', routes);
  app.use('/uploads', express.static(path.join(temp, 'uploads')));
  app.use((err, _req, res, _next) => res.status(err.statusCode || 500).json({ message: err.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const token = role => jwt.sign({ id: 'test-admin', role }, config.jwtSecret);
  async function send(endpoint, fields = {}, image, role = 'Admin') {
    const body = new FormData();
    for (const [key, value] of Object.entries(fields)) body.append(key, value);
    if (image) body.append('cover_image', new Blob([image.bytes], { type: image.type }), 'schedule.png');
    const res = await fetch(base + '/video/' + endpoint, {
      method: endpoint === 'create' ? 'POST' : 'PATCH', body,
      headers: role ? { Authorization: `Bearer ${token(role)}` } : {},
    });
    return { status: res.status, body: await res.json() };
  }
  try {
    await t.test('public read starts empty; writes require admin', async () => {
      assert.equal((await (await fetch(base + '/video/get')).json()).data, null);
      assert.equal((await send('create', { url_1: '' }, null, null)).status, 401);
      assert.equal((await send('create', { url_1: '' }, null, 'User')).status, 403);
    });
    await t.test('first save accepts only schedule image', async () => {
      const result = await send('create', {}, { bytes: png, type: 'image/png' });
      assert.equal(result.status, 200);
      assert.match(record.url_5, /^\/uploads\/images\/schedule-.*\.png$/);
      assert.equal((await fetch(base + record.url_5)).status, 200);
    });
    await t.test('video edit normalizes share URL and keeps existing image', async () => {
      const previousImage = record.url_5;
      const result = await send('update', { id: record.id, url_1: 'https://www.instagram.com/reel/ABC_123/?igsh=xyz', url_2: '' });
      assert.equal(result.status, 200);
      assert.equal(record.url_1, 'https://www.instagram.com/reel/ABC_123/');
      assert.equal(record.url_5, previousImage);
    });
    await t.test('repeat create reuses existing content; replacement gets unique URL', async () => {
      const previousImage = record.url_5;
      assert.equal((await send('create', { url_3: '' }, { bytes: png, type: 'image/png' })).status, 200);
      assert.equal(record.id, 'test-content');
      assert.notEqual(record.url_5, previousImage);
    });
    await t.test('invalid URLs, forged image and oversized file are rejected', async () => {
      assert.equal((await send('update', { id: record.id, url_1: 'https://evil.example/reel/abc' })).status, 400);
      assert.equal((await send('update', { id: record.id }, { bytes: Buffer.from('not an image'), type: 'image/png' })).status, 400);
      assert.equal((await send('update', { id: record.id }, { bytes: Buffer.alloc(5 * 1024 * 1024 + 1), type: 'image/png' })).status, 400);
    });
    await t.test('missing ID rejected; failed database update cleans new file', async () => {
      assert.equal((await send('update', { url_1: '' })).status, 400);
      const before = await fs.readdir(path.join(temp, 'uploads/images'));
      assert.equal((await send('update', { id: 'missing' }, { bytes: png, type: 'image/png' })).status, 404);
      assert.deepEqual(await fs.readdir(path.join(temp, 'uploads/images')), before);
    });
    await t.test('explicit removal clears image and video; public read reflects save', async () => {
      assert.equal((await send('update', { id: record.id, remove_image: 'true', url_1: '' })).status, 200);
      const result = await (await fetch(base + '/video/get')).json();
      assert.equal(result.data.url_5, null);
      assert.equal(result.data.url_1, '');
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
    process.chdir(oldCwd);
    await fs.rm(temp, { recursive: true, force: true });
  }
});
