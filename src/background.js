if (typeof importScripts === 'function') {
  importScripts('screenshotCapture.js');
}

(() => {
  const BADGE_COLORS = {
    green:  [34, 139, 34, 255],
    yellow: [218, 165, 32, 255],
    orange: [255, 140, 0, 255],
    red:    [220, 38, 38, 255]
  };

  function badgeColorForScore(score) {
    if (score <= 25) return BADGE_COLORS.green;
    if (score <= 50) return BADGE_COLORS.yellow;
    if (score <= 75) return BADGE_COLORS.orange;
    return BADGE_COLORS.red;
  }

  function updateBadge(tabId, score) {
    const text = String(score);
    const color = badgeColorForScore(score);
    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color, tabId });
  }

  function clearBadge(tabId) {
    chrome.action.setBadgeText({ text: '', tabId });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'SCAN_RESULT') {
      const tabId = sender?.tab?.id;
      if (tabId == null) return;
      const score = message.receipt?.score;
      if (typeof score !== 'number') return;
      updateBadge(tabId, score);
      return;
    }

    if (message?.type === 'CAPTURE_SCREENSHOT') {
      const tabId = sender.tab?.id;
      if (!tabId) {
        sendResponse({ success: false, error: 'No tab context' });
        return true;
      }

      const caseId = message.caseId;
      if (!caseId) {
        sendResponse({ success: false, error: 'Missing caseId' });
        return true;
      }

      CloakScreenshot.captureEvidence(tabId)
        .then((dataUrl) => {
          if (!dataUrl) {
            sendResponse({ success: false, error: 'Capture returned empty' });
            return;
          }
          return CloakScreenshot.saveScreenshot(caseId, dataUrl).then((storageKey) => {
            sendResponse({ success: true, storageKey });
          });
        })
        .catch((err) => {
          sendResponse({ success: false, error: err.message });
        });

      return true;
    }
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      clearBadge(tabId);
    }
  });

  if (typeof module !== 'undefined') {
    module.exports = { badgeColorForScore, updateBadge, clearBadge, BADGE_COLORS };
  }
})();
