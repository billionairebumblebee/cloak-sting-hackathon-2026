(() => {
  const STORAGE_KEY = 'cloakStingLatestReceipt';
  const MIN_VISIBLE_SCORE = 35;

  function getPageText() {
    const bodyText = document.body ? document.body.innerText : '';
    const inputs = Array.from(document.querySelectorAll('input, textarea, button, a'))
      .map((el) => [el.getAttribute('aria-label'), el.getAttribute('placeholder'), el.value, el.innerText, el.href].filter(Boolean).join(' '))
      .join(' ');
    return `${bodyText}\n${inputs}`.slice(0, 12000);
  }

  function buildReceipt(analysis) {
    return {
      id: `sting-${Date.now()}`,
      url: location.href,
      hostname: location.hostname,
      title: document.title,
      ...analysis
    };
  }

  function saveReceipt(receipt) {
    try {
      if (globalThis.chrome?.storage?.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: receipt });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
      }
    } catch (_) {}
  }

  function removeExistingOverlay() {
    document.getElementById('cloak-sting-overlay')?.remove();
  }

  function renderOverlay(receipt) {
    removeExistingOverlay();
    if (receipt.score < MIN_VISIBLE_SCORE) return;

    const root = document.createElement('section');
    root.id = 'cloak-sting-overlay';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'cloak sting scam warning');

    const findingItems = receipt.findings
      .slice(0, 4)
      .map((f) => `<li><strong>${escapeHtml(f.label)}</strong><span>${escapeHtml(f.evidence)}</span></li>`)
      .join('');

    root.innerHTML = `
      <style>
        #cloak-sting-overlay{position:fixed;right:18px;top:18px;z-index:2147483647;width:min(420px,calc(100vw - 36px));font:16px/1.45 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#111;background:rgba(255,255,255,.96);border:2px solid rgba(200,50,50,.3);box-shadow:0 24px 80px rgba(0,0,0,.28);border-radius:22px;overflow:hidden;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        #cloak-sting-overlay .bar{height:7px;background:linear-gradient(90deg,#111,#9f6bff,#ff5f7e)}
        #cloak-sting-overlay .inner{padding:18px}
        #cloak-sting-overlay h2{margin:0 0 10px;font-size:20px;letter-spacing:-.02em}
        #cloak-sting-overlay .risk{display:inline-flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 14px;border-radius:999px;background:#c0392b;color:white;font-weight:700;text-transform:uppercase;font-size:14px;letter-spacing:.06em}
        #cloak-sting-overlay p{margin:0 0 13px;color:#252525}
        #cloak-sting-overlay ul{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:8px}
        #cloak-sting-overlay li{display:grid;gap:2px;padding:12px;border-radius:14px;background:#f4f0ea}
        #cloak-sting-overlay li strong{font-size:15px}
        #cloak-sting-overlay li span{color:#665f58;font-size:13px;word-break:break-word}
        #cloak-sting-overlay .actions{display:flex;gap:10px;flex-wrap:wrap}
        #cloak-sting-overlay button{border:0;border-radius:999px;padding:13px 18px;font-size:15px;font-weight:700;cursor:pointer}
        #cloak-sting-overlay .primary{background:#111;color:white}
        #cloak-sting-overlay .ghost{background:#ece7df;color:#111}
      </style>
      <div class="bar"></div>
      <div class="inner">
        <h2>&#9888;&#65039; Warning — this page looks suspicious</h2>
        <div class="risk">${escapeHtml(receipt.risk)} risk · ${receipt.score}/100</div>
        <p style="font-size:15px;line-height:1.5">${escapeHtml(receipt.advice)}</p>
        <ul>${findingItems}</ul>
        <div class="actions">
          <button class="primary" data-cloak-action="copy">Copy receipt</button>
          <button class="ghost" data-cloak-action="dismiss">Dismiss</button>
        </div>
      </div>
    `;

    root.addEventListener('click', async (event) => {
      const action = event.target?.dataset?.cloakAction;
      if (action === 'dismiss') root.remove();
      if (action === 'copy') {
        await navigator.clipboard?.writeText(formatReceipt(receipt));
        event.target.textContent = 'Copied';
      }
    });

    document.documentElement.appendChild(root);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function formatReceipt(receipt) {
    const lines = [
      `cloak sting receipt`,
      `Risk: ${receipt.risk} (${receipt.score}/100)`,
      `Page: ${receipt.title || receipt.hostname}`,
      `URL: ${receipt.url}`,
      `Advice: ${receipt.advice}`,
      `Signals:`
    ];
    for (const finding of receipt.findings) lines.push(`- ${finding.label}: ${finding.evidence}`);
    return lines.join('\n');
  }

  function trySentryCaptureScam(receipt) {
    try {
      if (typeof require === 'function') {
        const { captureScamEvent } = require('./sentry.js');
        captureScamEvent(receipt).catch(() => {});
      }
    } catch (_) {}
  }

  function run() {
    if (!globalThis.CloakScamSignals) return;
    const analysis = globalThis.CloakScamSignals.analyzeScamSurface({
      title: document.title,
      url: location.href,
      hostname: location.hostname,
      text: getPageText()
    });
    const receipt = buildReceipt(analysis);
    saveReceipt(receipt);
    renderOverlay(receipt);
    if (receipt.risk === 'high' || receipt.risk === 'medium') {
      trySentryCaptureScam(receipt);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
