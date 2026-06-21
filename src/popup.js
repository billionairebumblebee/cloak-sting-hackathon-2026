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
  if (!receipt) return 'No scam receipt yet.';
  return [
    'CLOAK STING - SCAM WARNING RECEIPT',
    '------------------------------------',
    `Verdict: ${verdictText(receipt.risk)} (${receipt.score}/100)`,
    `Page: ${receipt.title || receipt.hostname}`,
    `URL: ${receipt.url}`,
    '',
    `ADVICE: ${receipt.advice}`,
    '',
    'WARNING SIGNALS:',
    ...receipt.findings.map((f) => `  - ${f.label}: ${f.evidence}`),
    '',
    'WHAT TO DO:',
    '  - Do NOT send money, gift cards, or crypto',
    '  - Report to your bank if you shared financial info',
    '  - File a report: reportfraud.ftc.gov or ic3.gov',
    '  - Tell a family member or friend',
    '',
    `Captured: ${receipt.analyzedAt || new Date().toISOString()}`
  ].join('\n');
}

function verdictText(risk) {
  if (risk === 'high') return 'Looks like a scam';
  if (risk === 'medium') return 'Looks suspicious';
  return 'Looks safe';
}

function riskClass(risk) {
  if (risk === 'high') return 'risk-high';
  if (risk === 'medium') return 'risk-medium';
  return 'risk-low';
}

function render(receipt) {
  const container = document.getElementById('receipt');
  latestReceipt = receipt;

  if (!receipt) {
    container.className = 'card empty';
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">You are protected</p>
        <p class="empty-hint">Click "Scan This Page" to check the current site, or browse normally. We will warn you if something looks wrong.</p>
      </div>
    `;
    return;
  }

  const findings = receipt.findings.slice(0, 5).map((f) => `
    <div class="finding">
      <strong>${escapeHtml(f.label)}</strong>
      <span>${escapeHtml(f.evidence)}</span>
    </div>
  `).join('');

  container.className = 'card';
  container.innerHTML = `
    <div class="risk-badge ${riskClass(receipt.risk)}">
      ${receipt.risk === 'high' ? '&#x26A0;' : receipt.risk === 'medium' ? '&#x26A0;' : '&#x2714;'}
      ${escapeHtml(verdictText(receipt.risk))}
    </div>
    <div class="receipt-title">${escapeHtml(receipt.title || receipt.hostname || 'Unknown page')}</div>
    <div class="receipt-url">${escapeHtml(receipt.url || '')}</div>
    <div class="receipt-advice">${escapeHtml(receipt.advice || '')}</div>
    <div class="findings">${findings}</div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function scanCurrentPage() {
  const scanBtn = document.getElementById('scan');
  scanBtn.classList.add('scanning');
  scanBtn.textContent = 'Scanning...';

  if (globalThis.chrome?.tabs?.query && globalThis.chrome?.scripting?.executeScript) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) {
        scanBtn.classList.remove('scanning');
        scanBtn.innerHTML = '<span class="scan-icon" aria-hidden="true"></span> Scan This Page';
        return;
      }
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['src/scamSignals.js', 'src/content.js']
      }, () => {
        setTimeout(async () => {
          const receipt = await getStoredReceipt();
          render(receipt);
          scanBtn.classList.remove('scanning');
          scanBtn.innerHTML = '<span class="scan-icon" aria-hidden="true"></span> Scan This Page';
        }, 500);
      });
    });
  } else {
    setTimeout(() => {
      scanBtn.classList.remove('scanning');
      scanBtn.innerHTML = '<span class="scan-icon" aria-hidden="true"></span> Scan This Page';
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  render(await getStoredReceipt());

  document.getElementById('scan').addEventListener('click', scanCurrentPage);

  document.getElementById('copy').addEventListener('click', async (event) => {
    await navigator.clipboard?.writeText(formatReceipt(latestReceipt));
    event.target.innerHTML = '&#x2705; Copied! Share with your bank or authorities.';
    setTimeout(() => {
      event.target.innerHTML = '<span class="btn-icon" aria-hidden="true">&#x1F4CB;</span> Copy receipt to report';
    }, 3000);
  });
});
