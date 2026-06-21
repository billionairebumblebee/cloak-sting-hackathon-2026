(() => {
  const STORAGE_KEY = 'cloakStingLatestReceipt';
  const HISTORY_KEY = 'cloakStingScanHistory';
  const HISTORY_LIMIT = 25;
  const MIN_VISIBLE_SCORE = 35;
  const BLOCK_SCORE = 50;

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

  function isDuplicateReceipt(history, receipt) {
    return history.some((h) => h.url === receipt.url && h.score === receipt.score);
  }

  function saveReceipt(receipt) {
    try {
      if (globalThis.chrome?.storage?.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: receipt });
        chrome.storage.local.get(HISTORY_KEY, (result) => {
          const history = result[HISTORY_KEY] || [];
          if (!isDuplicateReceipt(history, receipt)) {
            history.unshift(receipt);
            if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
            chrome.storage.local.set({ [HISTORY_KEY]: history });
          }
        });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
        let history = [];
        try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (_) {}
        if (!isDuplicateReceipt(history, receipt)) {
          history.unshift(receipt);
          if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT;
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
      }
    } catch (_) {}
  }

  function removeExistingOverlay() {
    document.getElementById('cloak-sting-overlay')?.remove();
  }

  function blockPageInputs() {
    if (document.getElementById('cloak-sting-input-shield')) return;
    const shield = document.createElement('div');
    shield.id = 'cloak-sting-input-shield';
    shield.innerHTML = `
      <style>
        #cloak-sting-input-shield {
          position: fixed;
          inset: 0;
          z-index: 2147483646;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          cursor: not-allowed;
          animation: cloakShieldIn 0.3s ease-out;
        }
        @keyframes cloakShieldIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>
    `;
    shield.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
    document.documentElement.appendChild(shield);
  }

  function unblockPageInputs() {
    document.getElementById('cloak-sting-input-shield')?.remove();
  }

  function verdictText(risk) {
    if (risk === 'high') return 'Looks like a scam';
    if (risk === 'medium') return 'Looks suspicious';
    return 'Looks safe';
  }

  function riskColor(risk) {
    if (risk === 'high') return { border: '#dc2626', text: '#fca5a5', glow: 'rgba(220,38,38,0.3)' };
    if (risk === 'medium') return { border: '#f59e0b', text: '#fcd34d', glow: 'rgba(245,158,11,0.3)' };
    return { border: '#22c55e', text: '#86efac', glow: 'rgba(34,197,94,0.3)' };
  }

  function showPersistentStrip(receipt) {
    const existing = document.getElementById('cloak-sting-strip');
    if (existing) return;
    const colors = riskColor(receipt.risk);
    const strip = document.createElement('div');
    strip.id = 'cloak-sting-strip';
    strip.innerHTML = `
      <style>
        #cloak-sting-strip {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 2147483645;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 8px 16px;
          background: rgba(13, 13, 15, 0.95);
          border-bottom: 2px solid ${colors.border};
          font: 14px/1.3 -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
          color: ${colors.text};
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: cloakStripIn 0.2s ease-out;
        }
        @keyframes cloakStripIn {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        #cloak-sting-strip .strip-text { font-weight: 700; }
        #cloak-sting-strip button {
          background: ${colors.border};
          color: white;
          border: none;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        #cloak-sting-strip button:hover { opacity: 0.85; }
      </style>
      <span class="strip-text">\u26A0 This page was flagged: ${escapeHtml(verdictText(receipt.risk))}</span>
      <button data-cloak-strip="show">Show warning</button>
    `;
    strip.addEventListener('click', (e) => {
      if (e.target?.dataset?.cloakStrip === 'show') {
        strip.remove();
        renderOverlay(receipt);
      }
    });
    document.documentElement.appendChild(strip);
  }

  function disablePageForms() {
    document.querySelectorAll('input, textarea, select, button:not([data-cloak-action])').forEach((el) => {
      if (!el.closest('#cloak-sting-overlay') && !el.closest('#cloak-sting-strip')) {
        el.dataset.cloakDisabled = el.disabled ? 'was-disabled' : 'enabled';
        el.disabled = true;
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  function enablePageForms() {
    document.querySelectorAll('[data-cloak-disabled]').forEach((el) => {
      if (el.dataset.cloakDisabled === 'enabled') {
        el.disabled = false;
        el.removeAttribute('tabindex');
      }
      delete el.dataset.cloakDisabled;
    });
  }

  function renderOverlay(receipt) {
    removeExistingOverlay();
    if (receipt.score < MIN_VISIBLE_SCORE) return;

    const shouldBlock = receipt.score >= BLOCK_SCORE;
    if (shouldBlock) {
      blockPageInputs();
      disablePageForms();
    }

    const root = document.createElement('section');
    root.id = 'cloak-sting-overlay';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Scam warning from cloak STING');
    root.setAttribute('aria-describedby', 'cloak-sting-advice');
    root.setAttribute('tabindex', '-1');

    const findingItems = receipt.findings
      .slice(0, 4)
      .map((f) => `<li><strong>${escapeHtml(f.label)}</strong><span>${escapeHtml(f.evidence)}</span></li>`)
      .join('');

    root.innerHTML = `
      <style>
        #cloak-sting-overlay{position:fixed;right:18px;top:18px;z-index:2147483647;width:min(420px,calc(100vw - 36px));font:1.125rem/1.45 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#111;background:rgba(255,255,255,.96);border:2px solid rgba(200,50,50,.3);box-shadow:0 24px 80px rgba(0,0,0,.28);border-radius:22px;overflow:hidden;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        #cloak-sting-overlay .bar{height:7px;background:linear-gradient(90deg,#111,#9f6bff,#ff5f7e)}
        #cloak-sting-overlay .inner{padding:18px}
        #cloak-sting-overlay h2{margin:0 0 10px;font-size:1.375rem;letter-spacing:-.02em}
        #cloak-sting-overlay .risk{display:inline-flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 14px;border-radius:999px;background:#c0392b;color:white;font-weight:700;text-transform:uppercase;font-size:0.875rem;letter-spacing:.06em}
        #cloak-sting-overlay p{margin:0 0 13px;color:#252525;font-size:1.0625rem}
        #cloak-sting-overlay ul{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:8px}
        #cloak-sting-overlay li{display:grid;gap:2px;padding:12px;border-radius:14px;background:#f4f0ea}
        #cloak-sting-overlay li strong{font-size:0.9375rem}
        #cloak-sting-overlay li span{color:#665f58;font-size:0.8125rem;word-break:break-word}
        #cloak-sting-overlay .actions{display:flex;gap:10px;flex-wrap:wrap}
        #cloak-sting-overlay button{border:0;border-radius:999px;padding:14px 20px;font-size:1rem;font-weight:700;cursor:pointer;min-height:44px;min-width:44px}
        #cloak-sting-overlay .primary{background:#111;color:white}
        #cloak-sting-overlay .ghost{background:#ece7df;color:#111}
      </style>
      <div class="bar"></div>
      <div class="inner">
        <h2>\u{1F6E1} Stop \u2014 ${verdictText(receipt.risk).toLowerCase()}</h2>
        <div class="risk">\u26A0 ${escapeHtml(receipt.risk)} risk</div>
        <p style="font-size:1rem;color:#444;margin:0 0 10px">You haven\u2019t done anything wrong. You\u2019re safe as long as you don\u2019t type anything here.</p>
        <p style="font-size:15px;line-height:1.5" id="cloak-sting-advice">${escapeHtml(receipt.advice)}</p>
        <ul>${findingItems}</ul>
        <div class="actions">
          <button class="primary" style="background:#dc2626" data-cloak-action="leave">\u2190 Take me somewhere safe</button>
          <button class="primary" data-cloak-action="copy">Save proof for my bank or family</button>
          <button class="ghost" data-cloak-action="dismiss">Hide warning (I understand the risk)</button>
        </div>
      </div>
    `;

    root.addEventListener('click', async (event) => {
      const action = event.target?.dataset?.cloakAction;
      if (action === 'dismiss') {
        root.remove();
        unblockPageInputs();
        enablePageForms();
        showPersistentStrip(receipt);
      }
      if (action === 'leave') {
        if (history.length > 1) history.back();
        else location.href = 'about:blank';
      }
      if (action === 'copy') {
        await navigator.clipboard?.writeText(formatReceipt(receipt));
        event.target.textContent = '\u2705 Saved! Paste in a message to show someone you trust.';
        setTimeout(() => { event.target.textContent = 'Save proof for my bank or family'; }, 4000);
      }
    });

    root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        root.remove();
        unblockPageInputs();
        enablePageForms();
        showPersistentStrip(receipt);
      }
    });

    document.documentElement.appendChild(root);
    root.focus();
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function formatReceipt(receipt) {
    const lines = [
      'CLOAK STING - SCAM WARNING RECEIPT',
      '------------------------------------',
      `Verdict: ${verdictText(receipt.risk)}`,
      `Page: ${receipt.title || receipt.hostname}`,
      `URL: ${receipt.url}`,
      '',
      `ADVICE: ${receipt.advice}`,
      '',
      'WARNING SIGNALS:'
    ];
    for (const finding of receipt.findings) lines.push(`  - ${finding.label}: ${finding.evidence}`);
    lines.push('', 'WHAT TO DO:', '  - Do NOT send money, gift cards, or crypto', '  - Report to your bank if you shared financial info', '  - File a report: reportfraud.ftc.gov or ic3.gov', '  - Tell a family member or friend', '', `Captured: ${receipt.analyzedAt || new Date().toISOString()}`);
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

  function requestScreenshot(receipt) {
    if (receipt.score < MIN_VISIBLE_SCORE) return;
    if (!globalThis.chrome?.runtime?.sendMessage) return;
    chrome.runtime.sendMessage({
      type: 'CAPTURE_SCREENSHOT',
      caseId: receipt.id
    }).then((response) => {
      if (response?.success) {
        receipt.evidence = {
          screenshotCaptured: true,
          screenshotKey: response.storageKey
        };
        saveReceipt(receipt);
      }
    }).catch(() => {});
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
    requestScreenshot(receipt);
    chrome.runtime?.sendMessage({ type: 'SCAN_RESULT', receipt });
  }

  /* ── Link pre-scan on hover ── */

  const TOOLTIP_ID = 'cloak-sting-link-tooltip';
  const HOVER_DEBOUNCE_MS = 300;
  let lastHoverCheck = 0;

  function isSameOrigin(href) {
    try {
      return new URL(href, location.href).origin === location.origin;
    } catch (_) {
      return true;
    }
  }

  function removeTooltip() {
    document.getElementById(TOOLTIP_ID)?.remove();
  }

  function showLinkTooltip(anchor, reason) {
    removeTooltip();
    const tip = document.createElement('div');
    tip.id = TOOLTIP_ID;
    tip.setAttribute('role', 'tooltip');
    const safeReason = escapeHtml(reason);
    tip.innerHTML = `
      <style>
        #${TOOLTIP_ID}{position:fixed;z-index:2147483647;max-width:320px;padding:8px 12px;font:12px/1.4 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#fff;background:#1a1a1a;border:1.5px solid #e85d3a;border-radius:10px;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.35)}
        #${TOOLTIP_ID} .warn-icon{margin-right:5px}
      </style>
      <span class="warn-icon">\u26A0\uFE0F</span>sting: Suspicious link \u2014 ${safeReason}
    `;

    const rect = anchor.getBoundingClientRect();
    tip.style.left = `${Math.min(rect.left, window.innerWidth - 340)}px`;
    tip.style.top = `${rect.bottom + 6}px`;

    document.documentElement.appendChild(tip);
  }

  function handleLinkHover(event) {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    if (isSameOrigin(href)) return;

    const now = Date.now();
    if (now - lastHoverCheck < HOVER_DEBOUNCE_MS) return;
    lastHoverCheck = now;

    if (!globalThis.CloakScamSignals) return;
    let hostname;
    try {
      hostname = new URL(href, location.href).hostname;
    } catch (_) {
      return;
    }
    const signals = globalThis.CloakScamSignals.hostnameSignals(hostname);
    if (signals.length > 0) {
      showLinkTooltip(anchor, signals[0].label);
    }
  }

  function handleLinkOut(event) {
    const anchor = event.target.closest('a');
    if (anchor) removeTooltip();
  }

  document.addEventListener('mouseover', handleLinkHover, true);
  document.addEventListener('mouseout', handleLinkOut, true);

  /* ── MutationObserver for dynamically-injected content ── */

  let rescanTimer = null;
  let lastScanText = '';
  const RESCAN_DEBOUNCE_MS = 1500;

  function observeDynamicContent() {
    if (!document.body) return;
    const observer = new MutationObserver(() => {
      if (rescanTimer) clearTimeout(rescanTimer);
      rescanTimer = setTimeout(() => {
        const currentText = getPageText();
        if (currentText !== lastScanText && currentText.length > lastScanText.length + 50) {
          lastScanText = currentText;
          run();
        }
      }, RESCAN_DEBOUNCE_MS);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function initialRun() {
    lastScanText = getPageText();
    run();
    observeDynamicContent();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialRun, { once: true });
  else initialRun();
})();
