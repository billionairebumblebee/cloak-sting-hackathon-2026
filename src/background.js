importScripts('screenshotCapture.js');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'CAPTURE_SCREENSHOT') return false;

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
});
