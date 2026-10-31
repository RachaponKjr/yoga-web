const { test } = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const now = new Date('2026-10-31T05:00:00Z');
const RealDate = Date;
const records = [
  { id: 'past', end: '2026-10-31T04:59:59Z' },
  { id: 'boundary', end: '2026-10-31T05:00:00Z' },
  { id: 'ongoing', end: '2026-10-31T12:30:00+07:00' },
  { id: 'future', end: '2026-11-01T10:00:00Z' },
];
let lastWhere;
function filter(where) {
  const time = where.round.endDateTime;
  assert.equal((time.gt || time.lte).getTime(), now.getTime());
  return records.filter(row => time.gt ? new Date(row.end) > time.gt : new Date(row.end) <= time.lte);
}
const dbPath = require.resolve('../src/config/prisma');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { __esModule: true, default: { booking: {
  findMany: async ({ where, skip = 0, take = 10 }) => { lastWhere = where; return filter(where).slice(skip, skip + take); },
  count: async ({ where }) => { assert.deepEqual(where, lastWhere); return filter(where).length; },
} } } };
const { getAllBookingService } = require('../src/services/booking.service');
const { getBookingListService } = require('../src/services/admin.service');
test('booking periods filter before pagination and preserve history', async () => {
  global.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [now])); } };
  try {
    const active = await getAllBookingService({ limit: 1, offset: 0 });
    assert.deepEqual(active.data.map(row => row.id), ['ongoing']);
    assert.equal(active.total, 2);
    const second = await getAllBookingService({ limit: 1, offset: 1, period: 'active' });
    assert.deepEqual(second.data.map(row => row.id), ['future']);
    assert.equal(second.total, 2);
    const past = await getAllBookingService({ limit: 10, offset: 0, period: 'past' });
    assert.deepEqual(past.data.map(row => row.id), ['past', 'boundary']);
    assert.equal(past.total, 2);
    const empty = await getAllBookingService({ limit: 10, offset: 10 });
    assert.equal(empty.data.length, 0);
    assert.equal(empty.total, 2);
    assert.deepEqual((await getBookingListService()).map(row => row.id), ['ongoing', 'future']);
    assert.deepEqual(lastWhere.status.in, ['PAID', 'PENDING']);
  } finally { global.Date = RealDate; }
});
