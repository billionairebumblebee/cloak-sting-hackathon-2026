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

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message?.type !== 'SCAN_RESULT') return;
    const tabId = sender?.tab?.id;
    if (tabId == null) return;
    const score = message.receipt?.score;
    if (typeof score !== 'number') return;
    updateBadge(tabId, score);
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
