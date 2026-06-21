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
  if (!receipt) return 'No safety report yet.';
  return [
    'Sting — Safety Report',
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
  latestReceipt = receipt;
  if (!receipt) {
    container.className = 'card muted';
    container.textContent = 'No warnings yet. This page looks safe so far.';
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
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

document.addEventListener('DOMContentLoaded', async () => {
  render(await getStoredReceipt());
  document.getElementById('copy').addEventListener('click', async (event) => {
    await navigator.clipboard?.writeText(formatReceipt(latestReceipt));
    event.target.textContent = 'Copied';
  });
});
