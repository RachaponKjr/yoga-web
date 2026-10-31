const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
let saved;
const dbPath = require.resolve('../src/config/prisma');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { __esModule: true, default: { user: {
  create: async ({ data, select }) => {
    if (saved?.email === data.email) throw { code: 'P2002' };
    saved = data;
    assert.equal(select.password, undefined);
    return { id: 'teacher', email: data.email, role: data.role, userInfo: data.userInfo.create };
  },
  findMany: async ({ where, select }) => {
    assert.equal(select.password, undefined);
    if (where.role === 'Instructor') return [{ id: 'teacher', role: 'Instructor' }];
    assert.deepEqual(where.role, { not: 'Instructor' });
    return [];
  },
} } } };
process.env.JWT_SECRET = 'instructor-test-only';
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const routes = require('../src/routes/admin.route').default;
const { RegisterInputSchema } = require('../src/types/auth.type');
const { config } = require('../src/config/env');
const { getUserAllService } = require('../src/services/auth.service');
test('admin instructor creation and member separation', async () => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.cookies = {}; next(); });
  app.use('/admin', routes);
  app.use((err, req, res, next) => res.status(err.statusCode || 500).json({ message: err.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/admin/instructors`;
  const payload = { email: 'teacher@example.com', password: 'secret123', firstName: 'Teacher', lastName: 'Yoga', experience: 'Yoga teaching', role: 'Admin' };
  const send = (role, body = payload, method = 'POST') => fetch(url, { method, headers: { 'Content-Type': 'application/json', ...(role ? { Authorization: `Bearer ${jwt.sign({ id: 'test', role }, config.jwtSecret)}` } : {}) }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
  try {
    assert.equal((await send(null)).status, 401);
    assert.equal((await send('Student')).status, 403);
    assert.equal((await send('Instructor')).status, 403);
    assert.equal((await send('Admin', { ...payload, firstName: ' ' })).status, 400);
    const created = await send('Admin');
    assert.equal(created.status, 201);
    assert.equal(saved.role, 'Instructor');
    assert.equal(await bcrypt.compare(payload.password, saved.password), true);
    assert.equal((await created.json()).data.password, undefined);
    assert.equal(saved.userInfo.create.experience, payload.experience);
    assert.equal((await send('Admin')).status, 409);
    assert.equal((await send('Student', undefined, 'GET')).status, 403);
    assert.equal((await (await send('Admin', undefined, 'GET')).json()).data[0].role, 'Instructor');
    assert.equal(RegisterInputSchema.safeParse(payload).success, false);
    assert.equal(RegisterInputSchema.parse({ email: payload.email, password: payload.password }).role, 'Student');
    assert.deepEqual(await getUserAllService(), []);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
