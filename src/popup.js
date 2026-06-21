const STORAGE_KEY = 'stingLatestReceipt';
const HISTORY_KEY = 'stingScanHistory';
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

function verdictText(risk) {
  if (risk === 'high') return 'Looks like a scam';
  if (risk === 'medium') return 'Looks suspicious';
  return 'Looks safe';
}

function formatReceipt(receipt) {
  if (!receipt) return 'No scam receipt yet.';
  return [
    'sting \u2014 scam warning receipt',
    '------------------------------------',
    `Verdict: ${verdictText(receipt.risk)}`,
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

function getMeterColor(score) {
  if (score >= 75) return '#ff4444';
  if (score >= 55) return '#ff8c42';
  if (score >= 35) return '#ffc42e';
  return '#4ade80';
}

function getMeterGlowClass(score) {
  if (score >= 75) return 'glow-red';
  if (score >= 55) return 'glow-orange';
  if (score >= 35) return 'glow-yellow';
  return 'glow-green';
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

function getCurrentTab() {
  return new Promise((resolve) => {
    if (globalThis.chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs?.[0] || null);
      });
    } else {
      resolve(null);
    }
  });
}

function renderStatusDashboard(receipt, tab) {
  const panel = document.getElementById('panel-scan');
  const hostname = tab?.url ? (() => { try { return new URL(tab.url).hostname; } catch (_) { return ''; } })() : '';
  const historyCount = scanHistory.length;
  const threatCount = scanHistory.filter((s) => s.score >= SAFE_THRESHOLD).length;
  const safeCount = scanHistory.filter((s) => s.score < SAFE_THRESHOLD).length;

  const isCurrentPageScanned = Boolean(receipt);
  const currentPageSafe = receipt ? receipt.score < SAFE_THRESHOLD : null;

  let statusHtml;
  if (!isCurrentPageScanned) {
    statusHtml = `
      <div class="status-indicator">
        <div class="pulse"></div>
        <div class="text">
          <h3>Protection active</h3>
          <p>Monitoring for scam patterns on every page</p>
        </div>
      </div>`;
  } else if (currentPageSafe) {
    statusHtml = `
      <div class="status-indicator">
        <div class="pulse"></div>
        <div class="text">
          <h3>Page looks safe</h3>
          <p>No scam signals detected on this page</p>
        </div>
      </div>`;
  } else {
    statusHtml = `
      <div class="status-indicator" style="background:rgba(255,68,68,.04);border-color:rgba(255,68,68,.15)">
        <div class="pulse" style="background:#ff4444;box-shadow:0 0 8px rgba(255,68,68,.6);animation:none"></div>
        <div class="text">
          <h3 style="color:#ff4444">Threat detected</h3>
          <p>See Threats tab for details</p>
        </div>
      </div>`;
  }

  panel.innerHTML = `
    <div class="status-dash">
      ${statusHtml}
      ${hostname ? `
      <div class="page-target">
        <div class="label">Current target</div>
        <div class="hostname">${escapeHtml(hostname)}</div>
        <div class="url">${escapeHtml(tab?.url || '')}</div>
      </div>` : ''}
      <div class="stats-grid">
        <div class="stat-card">
          <div class="value highlight">${historyCount}</div>
          <div class="label">Pages scanned</div>
        </div>
        <div class="stat-card">
          <div class="value" style="color:#ff4444">${threatCount}</div>
          <div class="label">Threats found</div>
        </div>
        <div class="stat-card">
          <div class="value" style="color:#4ade80">${safeCount}</div>
          <div class="label">Safe pages</div>
        </div>
        <div class="stat-card">
          <div class="value">10</div>
          <div class="label">Scam patterns</div>
        </div>
      </div>
      <div class="modules-section">
        <h4>Detection modules</h4>
        <div class="module-row">
          <div class="dot active"></div>
          <span class="name">Pattern engine</span>
          <span class="badge live">live</span>
        </div>
        <div class="module-row">
          <div class="dot active"></div>
          <span class="name">DOM scanner</span>
          <span class="badge live">live</span>
        </div>
        <div class="module-row">
          <div class="dot active"></div>
          <span class="name">Form interceptor</span>
          <span class="badge live">live</span>
        </div>
        <div class="module-row">
          <div class="dot standby"></div>
          <span class="name">Voice pipeline</span>
          <span class="badge ready">ready</span>
        </div>
        <div class="module-row">
          <div class="dot standby"></div>
          <span class="name">Link isolation</span>
          <span class="badge ready">ready</span>
        </div>
        <div class="module-row">
          <div class="dot standby"></div>
          <span class="name">AI explainer</span>
          <span class="badge local">local</span>
        </div>
      </div>
    </div>`;
}

function renderThreatsPanel(receipt) {
  const panel = document.getElementById('threats-content');
  latestReceipt = receipt;

  if (!receipt || receipt.score < SAFE_THRESHOLD) {
    panel.innerHTML = `
      <div class="safe-state">
        <div class="checkmark">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3>No threats on this page</h3>
        <p>${receipt ? escapeHtml(receipt.hostname || receipt.url) + '<br>' : ''}No strong scam signals detected.</p>
      </div>
      ${receipt ? '<div class="actions"><button class="btn-secondary" id="btn-copy">Save proof</button></div>' : ''}`;
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
      <div class="label"><span>Threat level</span><span>${verdictText(receipt.risk)}</span></div>
      <div class="meter-bar"><div class="meter-fill ${getMeterGlowClass(receipt.score)}" style="width:${receipt.score}%;background:${meterColor}"></div></div>
    </div>
    <div class="page-info">
      <div class="hostname">${escapeHtml(receipt.title || receipt.hostname || 'Unknown page')}</div>
      <div class="url">${escapeHtml(receipt.url || '')}</div>
    </div>
    <div class="signals-section">
      <h4>Why we\u2019re worried</h4>
      ${signalCards}
    </div>
    ${receipt.advice ? `<div class="advice-section"><h4>What to do</h4><p>${escapeHtml(receipt.advice)}</p></div>` : ''}
    ${receipt.evidence?.screenshotCaptured ? '<div class="actions"><button class="btn-secondary" id="btn-screenshot">View Screenshot</button></div>' : ''}
    <div class="actions">
      <button class="btn-primary" id="btn-copy">Save proof for my bank or family</button>
      <button class="btn-secondary" id="btn-download">Download evidence</button>
      <button class="btn-danger" id="btn-report">Report this scam</button>
    </div>`;
  bindActions();
}

function bindActions() {
  const copyBtn = document.getElementById('btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(formatReceipt(latestReceipt));
      copyBtn.textContent = 'Saved! Paste to share with someone you trust.';
      setTimeout(() => { copyBtn.textContent = 'Save proof for my bank or family'; }, 4000);
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
        a.download = `sting-evidence-${latestReceipt.id || 'unknown'}.png`;
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
    container.innerHTML = '<div class="history-empty">No scan history yet.<br><span style="color:#333;font-size:11px">Scanned pages will appear here automatically.</span></div>';
    return;
  }

  container.innerHTML = scanHistory.map((item, index) => {
    const riskClass = getRiskClass(item.risk);
    return `<div class="history-card" role="button" tabindex="0" aria-label="View scan for ${escapeHtml(item.hostname || item.title || 'Unknown')}" data-index="${index}">
      <div class="info">
        <div class="host">${escapeHtml(item.hostname || item.title || 'Unknown')}</div>
        <div class="time">${formatTimestamp(item.id)}</div>
      </div>
      <span class="risk-badge ${riskClass}" style="font-size:10px;padding:3px 7px">${escapeHtml(item.risk || 'safe')}</span>
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
      <div class="label"><span>Threat level</span><span>${verdictText(item.risk)}</span></div>
      <div class="meter-bar"><div class="meter-fill ${getMeterGlowClass(item.score)}" style="width:${item.score}%;background:${meterColor}"></div></div>
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
      <button class="btn-primary" id="btn-copy">Save proof for my bank or family</button>
      <button class="btn-secondary" id="btn-download">Download evidence</button>
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

  function activateTab(tab) {
    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');

    if (tab.dataset.tab === 'history') {
      currentDetailItem = null;
      renderHistoryPanel();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const tabArr = Array.from(tabs);
      const idx = tabArr.indexOf(tab);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = e.key === 'ArrowRight' ? (idx + 1) % tabArr.length : (idx - 1 + tabArr.length) % tabArr.length;
        tabArr[next].focus();
        activateTab(tabArr[next]);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initTabs();

  const data = await getStorage([STORAGE_KEY, HISTORY_KEY]);
  const receipt = data[STORAGE_KEY] || null;
  scanHistory = data[HISTORY_KEY] || [];
  latestReceipt = receipt;

  const tab = await getCurrentTab();
  renderStatusDashboard(receipt, tab);
  renderThreatsPanel(receipt);
  renderHistoryPanel();
});
