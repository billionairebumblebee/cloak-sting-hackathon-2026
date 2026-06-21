const STORAGE_KEY = 'cloakStingLatestReceipt';
const HISTORY_KEY = 'cloakStingScanHistory';
const SAFE_THRESHOLD = 35;

let latestReceipt = null;
let scanHistory = [];
let currentDetailItem = null;

function getStorage(keys) {
  return new Promise((resolve) => {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.get(keys, (result) => resolve(result));
      return;
    }
    const result = {};
    for (const key of keys) {
      try { result[key] = JSON.parse(localStorage.getItem(key) || 'null'); }
      catch (_) { result[key] = null; }
    }
    resolve(result);
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function formatReceipt(receipt) {
  if (!receipt) return 'No Sting receipt yet.';
  return [
    'Sting Threat Receipt',
    `Risk: ${receipt.risk} (${receipt.score}/100)`,
    `Page: ${receipt.title || receipt.hostname}`,
    `URL: ${receipt.url}`,
    `Advice: ${receipt.advice}`,
    'Signals:',
    ...receipt.findings.map((f) => `- ${f.label}: ${f.evidence}`)
  ].join('\n');
}

function getMeterColor(score) {
  if (score >= 75) return '#ff4444';
  if (score >= 55) return '#ff8c42';
  if (score >= 35) return '#ffc42e';
  return '#4ade80';
}

function getRiskClass(risk) {
  const r = (risk || '').toLowerCase();
  if (r === 'critical') return 'critical';
  if (r === 'high') return 'high';
  if (r === 'medium') return 'medium';
  if (r === 'low') return 'low';
  return 'safe';
}

function getSignalIcon(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('urgency') || t.includes('urgent')) return { cls: 'urgency', icon: '\u26a0\ufe0f' };
  if (t.includes('payment') || t.includes('fee') || t.includes('crypto')) return { cls: 'payment', icon: '\ud83d\udcb3' };
  if (t.includes('impersonat') || t.includes('trust')) return { cls: 'impersonation', icon: '\ud83c\udfad' };
  if (t.includes('pressure') || t.includes('secret') || t.includes('hostage') || t.includes('ransom')) return { cls: 'pressure', icon: '\ud83d\udd12' };
  return { cls: 'default', icon: '\ud83d\udea8' };
}

function formatTimestamp(id) {
  if (!id) return '';
  const ts = parseInt(id.replace('sting-', ''), 10);
  if (isNaN(ts)) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderScanPanel(receipt) {
  const panel = document.getElementById('panel-scan');
  latestReceipt = receipt;

  if (!receipt) {
    panel.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#555" stroke-width="2" stroke-dasharray="4 3"/><path d="M24 16v10M24 30v2" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>
        <p>No scan performed yet.<br>Visit a page to analyze it for threats.</p>
      </div>`;
    return;
  }

  if (receipt.score < SAFE_THRESHOLD) {
    panel.innerHTML = `
      <div class="safe-state">
        <div class="checkmark">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3>Page looks safe</h3>
        <p>${escapeHtml(receipt.hostname || receipt.url)}<br>Risk score: ${receipt.score}/100</p>
      </div>
      <div class="actions">
        <button class="btn-secondary" id="btn-copy">Copy Receipt</button>
      </div>`;
    bindActions();
    return;
  }

  const riskClass = getRiskClass(receipt.risk);
  const meterColor = getMeterColor(receipt.score);

  const signalCards = (receipt.findings || []).slice(0, 6).map((f) => {
    const si = getSignalIcon(f.type || f.label);
    return `<div class="signal-card">
      <div class="icon ${si.cls}">${si.icon}</div>
      <div class="content">
        <div class="label">${escapeHtml(f.label)}</div>
        <div class="evidence">${escapeHtml(f.evidence)}</div>
      </div>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="risk-header">
      <span class="risk-badge ${riskClass}">${escapeHtml(receipt.risk)}</span>
    </div>
    <div class="score-meter">
      <div class="label"><span>Threat Score</span><span>${receipt.score}/100</span></div>
      <div class="meter-bar"><div class="meter-fill" style="width:${receipt.score}%;background:${meterColor}"></div></div>
    </div>
    <div class="page-info">
      <div class="hostname">${escapeHtml(receipt.title || receipt.hostname || 'Unknown page')}</div>
      <div class="url">${escapeHtml(receipt.url || '')}</div>
    </div>
    <div class="signals-section">
      <h4>Signals detected</h4>
      ${signalCards}
    </div>
    ${receipt.advice ? `<div class="advice-section"><h4>Advice</h4><p>${escapeHtml(receipt.advice)}</p></div>` : ''}
    ${receipt.evidence?.screenshotCaptured ? '<div class="actions"><button class="btn-secondary" id="btn-screenshot">View Screenshot</button></div>' : ''}
    <div class="actions">
      <button class="btn-primary" id="btn-copy">Copy Receipt</button>
      <button class="btn-secondary" id="btn-download">Download JSON</button>
      <button class="btn-danger" id="btn-report">Report Scam</button>
    </div>`;
  bindActions();
}

function bindActions() {
  const copyBtn = document.getElementById('btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(formatReceipt(latestReceipt));
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy Receipt'; }, 2000);
    });
  }

  const downloadBtn = document.getElementById('btn-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!latestReceipt) return;
      const blob = new Blob([JSON.stringify(latestReceipt, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sting-receipt-${latestReceipt.id || 'unknown'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const reportBtn = document.getElementById('btn-report');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      const reportUrl = 'https://reportfraud.ftc.gov/';
      if (globalThis.chrome?.tabs?.create) {
        chrome.tabs.create({ url: reportUrl });
      } else {
        window.open(reportUrl, '_blank');
      }
    });
  }

  const screenshotBtn = document.getElementById('btn-screenshot');
  if (screenshotBtn && latestReceipt?.evidence?.screenshotKey) {
    screenshotBtn.addEventListener('click', async () => {
      const key = latestReceipt.evidence.screenshotKey;
      const data = await getStorage([key]);
      const dataUrl = data[key];
      if (!dataUrl) { screenshotBtn.textContent = 'No screenshot found'; return; }

      const modal = document.createElement('div');
      modal.className = 'screenshot-modal';
      modal.innerHTML = `
        <img src="${dataUrl}" alt="Evidence screenshot" />
        <div class="modal-actions">
          <button class="btn-export" id="modal-export">Export PNG</button>
          <button class="btn-close" id="modal-close">Close</button>
        </div>`;
      document.body.appendChild(modal);

      document.getElementById('modal-close').addEventListener('click', () => modal.remove());
      document.getElementById('modal-export').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `cloak-sting-evidence-${latestReceipt.id || 'unknown'}.png`;
        a.click();
      });
    });
  }
}

function renderHistoryPanel() {
  const container = document.getElementById('history-list');

  if (currentDetailItem) {
    renderHistoryDetail(currentDetailItem);
    return;
  }

  if (!scanHistory || scanHistory.length === 0) {
    container.innerHTML = '<div class="history-empty">No scan history yet.</div>';
    return;
  }

  container.innerHTML = scanHistory.map((item, index) => {
    const riskClass = getRiskClass(item.risk);
    const pillBg = item.score >= 75 ? '#3d0a0a' : item.score >= 55 ? '#3d1f0a' : item.score >= 35 ? '#3d350a' : '#0f2e1a';
    const pillColor = item.score >= 75 ? '#ff4444' : item.score >= 55 ? '#ff8c42' : item.score >= 35 ? '#ffc42e' : '#4ade80';
    return `<div class="history-card" data-index="${index}">
      <div class="info">
        <div class="host">${escapeHtml(item.hostname || item.title || 'Unknown')}</div>
        <div class="time">${formatTimestamp(item.id)}</div>
      </div>
      <span class="risk-badge ${riskClass}" style="font-size:10px;padding:3px 7px">${escapeHtml(item.risk || 'SAFE')}</span>
      <span class="score-pill" style="background:${pillBg};color:${pillColor}">${item.score}</span>
    </div>`;
  }).join('');

  container.querySelectorAll('.history-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      currentDetailItem = scanHistory[idx];
      renderHistoryDetail(currentDetailItem);
    });
  });
}

function renderHistoryDetail(item) {
  const container = document.getElementById('history-list');
  latestReceipt = item;
  const riskClass = getRiskClass(item.risk);
  const meterColor = getMeterColor(item.score);

  const signalCards = (item.findings || []).slice(0, 6).map((f) => {
    const si = getSignalIcon(f.type || f.label);
    return `<div class="signal-card">
      <div class="icon ${si.cls}">${si.icon}</div>
      <div class="content">
        <div class="label">${escapeHtml(f.label)}</div>
        <div class="evidence">${escapeHtml(f.evidence)}</div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="detail-back" id="history-back">\u2190 Back to history</div>
    <div class="risk-header">
      <span class="risk-badge ${riskClass}">${escapeHtml(item.risk)}</span>
    </div>
    <div class="score-meter">
      <div class="label"><span>Threat Score</span><span>${item.score}/100</span></div>
      <div class="meter-bar"><div class="meter-fill" style="width:${item.score}%;background:${meterColor}"></div></div>
    </div>
    <div class="page-info">
      <div class="hostname">${escapeHtml(item.title || item.hostname || 'Unknown page')}</div>
      <div class="url">${escapeHtml(item.url || '')}</div>
    </div>
    <div class="signals-section">
      <h4>Signals detected</h4>
      ${signalCards}
    </div>
    ${item.advice ? `<div class="advice-section"><h4>Advice</h4><p>${escapeHtml(item.advice)}</p></div>` : ''}
    <div class="actions">
      <button class="btn-primary" id="btn-copy">Copy Receipt</button>
      <button class="btn-secondary" id="btn-download">Download JSON</button>
    </div>`;

  document.getElementById('history-back').addEventListener('click', () => {
    currentDetailItem = null;
    renderHistoryPanel();
  });
  bindActions();
}

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');

      if (tab.dataset.tab === 'history') {
        currentDetailItem = null;
        renderHistoryPanel();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initTabs();

  const data = await getStorage([STORAGE_KEY, HISTORY_KEY]);
  const receipt = data[STORAGE_KEY] || null;
  scanHistory = data[HISTORY_KEY] || [];

  renderScanPanel(receipt);
  renderHistoryPanel();
});
