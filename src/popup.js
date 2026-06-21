const STORAGE_KEY = 'cloakStingLatestReceipt';
let latestReceipt = null;

function getStoredReceipt() {
  return new Promise((resolve) => {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.get(STORAGE_KEY, (value) => resolve(value[STORAGE_KEY] || null));
      return;
    }
    try { resolve(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); }
    catch (_) { resolve(null); }
  });
}

function formatReceipt(receipt) {
  if (!receipt) return 'No cloak sting receipt yet.';
  return [
    'cloak sting receipt',
    `Risk: ${receipt.risk} (${receipt.score}/100)`,
    `Page: ${receipt.title || receipt.hostname}`,
    `URL: ${receipt.url}`,
    `Advice: ${receipt.advice}`,
    'Signals:',
    ...receipt.findings.map((f) => `- ${f.label}: ${f.evidence}`)
  ].join('\n');
}

function render(receipt) {
  const container = document.getElementById('receipt');
  const screenshotBtn = document.getElementById('viewScreenshot');
  latestReceipt = receipt;
  if (!receipt) {
    container.className = 'card muted';
    container.textContent = 'No receipt yet. Open a suspicious demo page.';
    screenshotBtn.style.display = 'none';
    return;
  }

  const findings = receipt.findings.slice(0, 5).map((f) => `
    <div class="finding"><strong>${escapeHtml(f.label)}</strong><span>${escapeHtml(f.evidence)}</span></div>
  `).join('');

  container.className = 'card';
  container.innerHTML = `
    <div class="risk">${escapeHtml(receipt.risk)} risk · ${receipt.score}/100</div>
    <div><strong>${escapeHtml(receipt.title || receipt.hostname || 'Suspicious page')}</strong></div>
    <div class="url">${escapeHtml(receipt.url || '')}</div>
    <div>${escapeHtml(receipt.advice || '')}</div>
    <div class="findings">${findings}</div>
  `;

  screenshotBtn.style.display = receipt.evidence?.screenshotCaptured ? '' : 'none';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function showScreenshotModal(dataUrl) {
  const modal = document.getElementById('screenshotModal');
  const img = document.getElementById('screenshotImage');
  img.src = dataUrl;
  modal.style.display = 'flex';
}

function hideScreenshotModal() {
  const modal = document.getElementById('screenshotModal');
  modal.style.display = 'none';
  document.getElementById('screenshotImage').src = '';
}

function exportScreenshotAsPng(dataUrl, caseId) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `cloak-sting-evidence-${caseId}.png`;
  link.click();
}

document.addEventListener('DOMContentLoaded', async () => {
  render(await getStoredReceipt());

  document.getElementById('copy').addEventListener('click', async (event) => {
    await navigator.clipboard?.writeText(formatReceipt(latestReceipt));
    event.target.textContent = 'Copied';
  });

  document.getElementById('viewScreenshot').addEventListener('click', async () => {
    if (!latestReceipt?.id) return;
    const dataUrl = globalThis.CloakScreenshot
      ? await CloakScreenshot.getScreenshot(latestReceipt.id)
      : null;
    if (dataUrl) {
      showScreenshotModal(dataUrl);
    }
  });

  document.getElementById('closeModal').addEventListener('click', hideScreenshotModal);

  document.getElementById('screenshotModal').addEventListener('click', (event) => {
    if (event.target.id === 'screenshotModal') hideScreenshotModal();
  });

  document.getElementById('exportScreenshot').addEventListener('click', async () => {
    if (!latestReceipt?.id) return;
    const dataUrl = globalThis.CloakScreenshot
      ? await CloakScreenshot.getScreenshot(latestReceipt.id)
      : null;
    if (dataUrl) {
      exportScreenshotAsPng(dataUrl, latestReceipt.id);
    }
  });
});
