const test = require('node:test');
const assert = require('node:assert/strict');

/* Stub chrome API before requiring background.js */
const badgeCalls = { text: [], color: [] };
globalThis.chrome = {
  action: {
    setBadgeText(opts) { badgeCalls.text.push(opts); },
    setBadgeBackgroundColor(opts) { badgeCalls.color.push(opts); }
  },
  runtime: { onMessage: { addListener() {} } },
  tabs: { onUpdated: { addListener() {} } }
};

const { badgeColorForScore, BADGE_COLORS, updateBadge, clearBadge } = require('../src/background.js');

function resetCalls() {
  badgeCalls.text.length = 0;
  badgeCalls.color.length = 0;
}

test('green badge for score 0-25', () => {
  assert.deepEqual(badgeColorForScore(0), BADGE_COLORS.green);
  assert.deepEqual(badgeColorForScore(15), BADGE_COLORS.green);
  assert.deepEqual(badgeColorForScore(25), BADGE_COLORS.green);
});

test('yellow badge for score 26-50', () => {
  assert.deepEqual(badgeColorForScore(26), BADGE_COLORS.yellow);
  assert.deepEqual(badgeColorForScore(40), BADGE_COLORS.yellow);
  assert.deepEqual(badgeColorForScore(50), BADGE_COLORS.yellow);
});

test('orange badge for score 51-75', () => {
  assert.deepEqual(badgeColorForScore(51), BADGE_COLORS.orange);
  assert.deepEqual(badgeColorForScore(60), BADGE_COLORS.orange);
  assert.deepEqual(badgeColorForScore(75), BADGE_COLORS.orange);
});

test('red badge for score 76-100', () => {
  assert.deepEqual(badgeColorForScore(76), BADGE_COLORS.red);
  assert.deepEqual(badgeColorForScore(90), BADGE_COLORS.red);
  assert.deepEqual(badgeColorForScore(100), BADGE_COLORS.red);
});

test('updateBadge sets text and color on the correct tab', () => {
  resetCalls();
  updateBadge(42, 63);
  assert.equal(badgeCalls.text.length, 1);
  assert.deepEqual(badgeCalls.text[0], { text: '63', tabId: 42 });
  assert.equal(badgeCalls.color.length, 1);
  assert.deepEqual(badgeCalls.color[0], { color: BADGE_COLORS.orange, tabId: 42 });
});

test('clearBadge sets empty text', () => {
  resetCalls();
  clearBadge(7);
  assert.equal(badgeCalls.text.length, 1);
  assert.deepEqual(badgeCalls.text[0], { text: '', tabId: 7 });
});

test('boundary: score exactly at threshold edges', () => {
  assert.deepEqual(badgeColorForScore(25), BADGE_COLORS.green);
  assert.deepEqual(badgeColorForScore(26), BADGE_COLORS.yellow);
  assert.deepEqual(badgeColorForScore(50), BADGE_COLORS.yellow);
  assert.deepEqual(badgeColorForScore(51), BADGE_COLORS.orange);
  assert.deepEqual(badgeColorForScore(75), BADGE_COLORS.orange);
  assert.deepEqual(badgeColorForScore(76), BADGE_COLORS.red);
});
