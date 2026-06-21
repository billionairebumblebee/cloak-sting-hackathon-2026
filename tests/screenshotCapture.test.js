const test = require('node:test');
const assert = require('node:assert/strict');

function createMockChromeStorage() {
  const store = {};
  return {
    local: {
      get: async (key) => {
        if (typeof key === 'string') return { [key]: store[key] };
        const result = {};
        for (const k of (Array.isArray(key) ? key : [key])) {
          if (store[k] !== undefined) result[k] = store[k];
        }
        return result;
      },
      set: async (items) => { Object.assign(store, items); },
      remove: async (key) => { delete store[key]; }
    },
    _store: store
  };
}

function createMockChrome() {
  const storage = createMockChromeStorage();
  return {
    storage,
    tabs: {
      get: async (tabId) => ({ id: tabId, windowId: 1 }),
      captureVisibleTab: async () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk'
    }
  };
}

function loadModule() {
  const mockChrome = createMockChrome();
  globalThis.chrome = mockChrome;
  delete require.cache[require.resolve('../src/screenshotCapture.js')];
  const mod = require('../src/screenshotCapture.js');
  return { mod, mockChrome };
}

test('captureEvidence returns a data URL on success', async () => {
  const { mod } = loadModule();
  const dataUrl = await mod.captureEvidence(42);
  assert.ok(dataUrl);
  assert.ok(dataUrl.startsWith('data:image/png'));
});

test('captureEvidence returns null on failure', async () => {
  const { mod, mockChrome } = loadModule();
  mockChrome.tabs.captureVisibleTab = async () => { throw new Error('Permission denied'); };
  const result = await mod.captureEvidence(42);
  assert.equal(result, null);
});

test('saveScreenshot stores data and returns storage key', async () => {
  const { mod, mockChrome } = loadModule();
  const dataUrl = 'data:image/png;base64,abc123';
  const key = await mod.saveScreenshot('case-001', dataUrl);
  assert.equal(key, 'sting:screenshot:case-001');
  assert.equal(mockChrome.storage._store[key], dataUrl);
});

test('getScreenshot retrieves stored screenshot', async () => {
  const { mod } = loadModule();
  const dataUrl = 'data:image/png;base64,xyz789';
  await mod.saveScreenshot('case-002', dataUrl);
  const result = await mod.getScreenshot('case-002');
  assert.equal(result, dataUrl);
});

test('getScreenshot returns null for missing case', async () => {
  const { mod } = loadModule();
  const result = await mod.getScreenshot('nonexistent');
  assert.equal(result, null);
});

test('evicts oldest screenshots when at capacity', async () => {
  const { mod, mockChrome } = loadModule();
  for (let i = 0; i < 10; i++) {
    await mod.saveScreenshot(`old-${i}`, `data:image/png;base64,old${i}`);
  }
  const indexBefore = await mod.getScreenshotIndex();
  assert.equal(indexBefore.length, 10);

  await mod.saveScreenshot('new-case', 'data:image/png;base64,newdata');
  const indexAfter = await mod.getScreenshotIndex();
  assert.equal(indexAfter.length, 10);
  assert.ok(!indexAfter.includes('old-0'));
  assert.ok(indexAfter.includes('new-case'));
  assert.equal(mockChrome.storage._store['sting:screenshot:old-0'], undefined);
  assert.equal(mockChrome.storage._store['sting:screenshot:new-case'], 'data:image/png;base64,newdata');
});

test('screenshot index tracks insertion order', async () => {
  const { mod } = loadModule();
  await mod.saveScreenshot('a', 'data:image/png;base64,a');
  await mod.saveScreenshot('b', 'data:image/png;base64,b');
  await mod.saveScreenshot('c', 'data:image/png;base64,c');
  const index = await mod.getScreenshotIndex();
  assert.deepEqual(index, ['a', 'b', 'c']);
});

test('constants are exported correctly', () => {
  const { mod } = loadModule();
  assert.equal(mod.SCREENSHOT_PREFIX, 'sting:screenshot:');
  assert.equal(mod.SCREENSHOT_INDEX_KEY, 'sting:screenshotIndex');
  assert.equal(mod.MAX_SCREENSHOTS, 10);
});
