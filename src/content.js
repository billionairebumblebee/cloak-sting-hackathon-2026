(() => {
  const STORAGE_KEY = 'cloakStingLatestReceipt';
  const HISTORY_KEY = 'cloakStingScanHistory';
  const HISTORY_LIMIT = 25;
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
        chrome.storage.local.get(HISTORY_KEY, (result) => {
          const history = result[HISTORY_KEY] || [];
          history.unshift(receipt);
          if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
          chrome.storage.local.set({ [HISTORY_KEY]: history });
        });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
        let history = [];
        try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (_) {}
        history.unshift(receipt);
        if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
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
        #cloak-sting-overlay{position:fixed;right:18px;top:18px;z-index:2147483647;width:min(390px,calc(100vw - 36px));font:14px/1.35 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#111;background:rgba(255,255,255,.94);border:1px solid rgba(20,20,20,.14);box-shadow:0 24px 80px rgba(0,0,0,.28);border-radius:22px;overflow:hidden;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        #cloak-sting-overlay .bar{height:7px;background:linear-gradient(90deg,#111,#9f6bff,#ff5f7e)}
        #cloak-sting-overlay .inner{padding:18px}
        #cloak-sting-overlay h2{margin:0 0 8px;font-size:20px;letter-spacing:-.03em;text-transform:lowercase}
        #cloak-sting-overlay .risk{display:inline-flex;align-items:center;gap:8px;margin:0 0 12px;padding:7px 10px;border-radius:999px;background:#111;color:white;font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.08em}
        #cloak-sting-overlay p{margin:0 0 13px;color:#252525}
        #cloak-sting-overlay ul{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:8px}
        #cloak-sting-overlay li{display:grid;gap:2px;padding:10px;border-radius:14px;background:#f4f0ea}
        #cloak-sting-overlay li span{color:#665f58;font-size:12px;word-break:break-word}
        #cloak-sting-overlay .actions{display:flex;gap:8px;flex-wrap:wrap}
        #cloak-sting-overlay button{border:0;border-radius:999px;padding:10px 12px;font-weight:700;cursor:pointer}
        #cloak-sting-overlay .primary{background:#111;color:white}
        #cloak-sting-overlay .ghost{background:#ece7df;color:#111}
      </style>
      <div class="bar"></div>
      <div class="inner">
        <h2>cloak sting caught a pattern</h2>
        <div class="risk">${escapeHtml(receipt.risk)} risk · ${receipt.score}/100</div>
        <p>${escapeHtml(receipt.advice)}</p>
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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
