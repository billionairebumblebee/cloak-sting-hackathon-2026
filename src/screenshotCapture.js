(function attachScreenshotCapture(global) {
  const SCREENSHOT_PREFIX = 'sting:screenshot:';
  const SCREENSHOT_INDEX_KEY = 'sting:screenshotIndex';
  const MAX_SCREENSHOTS = 10;

  async function captureEvidence(tabId) {
    try {
      const tab = await chrome.tabs.get(tabId);
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
        format: 'png'
      });
      return dataUrl;
    } catch (err) {
      console.warn('[sting] screenshot capture failed:', err.message);
      return null;
    }
  }

  async function getScreenshotIndex() {
    const result = await chrome.storage.local.get(SCREENSHOT_INDEX_KEY);
    return result[SCREENSHOT_INDEX_KEY] || [];
  }

  async function setScreenshotIndex(index) {
    await chrome.storage.local.set({ [SCREENSHOT_INDEX_KEY]: index });
  }

  async function evictOldScreenshots() {
    const index = await getScreenshotIndex();
    while (index.length >= MAX_SCREENSHOTS) {
      const oldest = index.shift();
      await chrome.storage.local.remove(SCREENSHOT_PREFIX + oldest);
    }
    await setScreenshotIndex(index);
    return index;
  }

  async function saveScreenshot(caseId, dataUrl) {
    const storageKey = SCREENSHOT_PREFIX + caseId;
    await evictOldScreenshots();
    await chrome.storage.local.set({ [storageKey]: dataUrl });
    const index = await getScreenshotIndex();
    index.push(caseId);
    await setScreenshotIndex(index);
    return storageKey;
  }

  async function getScreenshot(caseId) {
    const storageKey = SCREENSHOT_PREFIX + caseId;
    const result = await chrome.storage.local.get(storageKey);
    return result[storageKey] || null;
  }

  global.CloakScreenshot = {
    captureEvidence,
    saveScreenshot,
    getScreenshot,
    getScreenshotIndex,
    evictOldScreenshots,
    SCREENSHOT_PREFIX,
    SCREENSHOT_INDEX_KEY,
    MAX_SCREENSHOTS
  };

  if (typeof module !== 'undefined') {
    module.exports = global.CloakScreenshot;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
