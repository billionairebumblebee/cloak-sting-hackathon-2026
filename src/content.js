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
      analyzedAt: new Date().toISOString(),
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
    document.getElementById('cloak-sting-strip')?.remove();
  }

  function riskColor(risk) {
    if (risk === 'high') return { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', text: '#ef4444', glow: 'rgba(239,68,68,0.3)' };
    if (risk === 'medium') return { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', text: '#f59e0b', glow: 'rgba(245,158,11,0.3)' };
    return { bg: 'rgba(34,197,94,0.12)', border: '#22c55e', text: '#22c55e', glow: 'rgba(34,197,94,0.3)' };
  }

  function verdictText(risk) {
    if (risk === 'high') return 'Looks like a scam';
    if (risk === 'medium') return 'Looks suspicious';
    return 'Looks safe';
  }

  function blockPageInputs() {
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
          top: 0;
          left: 0;
          right: 0;
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
        #cloak-sting-strip .strip-text {
          font-weight: 700;
        }
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
      <span class="strip-text">&#x26A0; This page was flagged: ${escapeHtml(verdictText(receipt.risk))}</span>
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

  function renderOverlay(receipt) {
    removeExistingOverlay();
    if (receipt.score < MIN_VISIBLE_SCORE) return;

    const shouldBlock = receipt.score >= BLOCK_SCORE;
    if (shouldBlock) blockPageInputs();

    const colors = riskColor(receipt.risk);
    const root = document.createElement('section');
    root.id = 'cloak-sting-overlay';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-label', 'Scam warning from Cloak Sting');
    root.setAttribute('aria-describedby', 'cloak-sting-advice');

    const findingItems = receipt.findings
      .slice(0, 3)
      .map((f) => `<li><strong>${escapeHtml(f.label)}</strong><span>${escapeHtml(f.evidence)}</span></li>`)
      .join('');

    root.innerHTML = `
      <style>
        #cloak-sting-overlay {
          position: fixed;
          right: 20px;
          top: 20px;
          z-index: 2147483647;
          width: min(420px, calc(100vw - 40px));
          font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
          color: #f5f5f7;
          background: rgba(13,13,15,0.97);
          border: 2px solid ${colors.border};
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${colors.glow};
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          animation: cloakSlideIn 0.3s ease-out;
        }
        @keyframes cloakSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #cloak-sting-overlay .bar {
          height: 5px;
          background: linear-gradient(90deg, ${colors.border}, #8b5cf6, ${colors.border});
        }
        #cloak-sting-overlay .inner { padding: 20px; }
        #cloak-sting-overlay .header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        #cloak-sting-overlay .shield {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        #cloak-sting-overlay h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        #cloak-sting-overlay .verdict {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 12px;
          padding: 8px 14px;
          border-radius: 999px;
          background: ${colors.bg};
          color: ${colors.text};
          border: 1.5px solid ${colors.border};
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 0.02em;
        }
        #cloak-sting-overlay .advice {
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 12px;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border-left: 3px solid #8b5cf6;
          color: #e5e5e7;
        }
        #cloak-sting-overlay ul {
          margin: 0 0 14px;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 6px;
        }
        #cloak-sting-overlay li {
          display: grid;
          gap: 2px;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
        }
        #cloak-sting-overlay li strong {
          font-size: 13px;
          font-weight: 700;
          color: #f5f5f7;
        }
        #cloak-sting-overlay li span {
          color: #a1a1a6;
          font-size: 12px;
          word-break: break-word;
          line-height: 1.4;
        }
        #cloak-sting-overlay .actions {
          display: grid;
          gap: 8px;
        }
        #cloak-sting-overlay button {
          border: 0;
          border-radius: 12px;
          padding: 14px 16px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 48px;
          width: 100%;
          text-align: center;
        }
        #cloak-sting-overlay button:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
        #cloak-sting-overlay .btn-leave {
          background: #ef4444;
          color: white;
          font-size: 17px;
        }
        #cloak-sting-overlay .btn-leave:hover { background: #dc2626; }
        #cloak-sting-overlay .btn-report {
          background: #8b5cf6;
          color: white;
        }
        #cloak-sting-overlay .btn-report:hover { background: #7c3aed; }
        #cloak-sting-overlay .btn-hide {
          background: rgba(255,255,255,0.06);
          color: #a1a1a6;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 13px;
          padding: 10px 12px;
          min-height: 38px;
        }
        #cloak-sting-overlay .btn-hide:hover { background: rgba(255,255,255,0.1); color: #e5e5e7; }
        #cloak-sting-overlay .row { display: flex; gap: 8px; }
        #cloak-sting-overlay .row button { flex: 1; }
      </style>
      <div class="bar"></div>
      <div class="inner">
        <div class="header">
          <div class="shield" aria-hidden="true">&#x1F6E1;</div>
          <h2>${verdictText(receipt.risk)}</h2>
        </div>
        <div class="verdict">&#x26A0; ${escapeHtml(receipt.risk)} risk</div>
        <p class="advice" id="cloak-sting-advice">${escapeHtml(receipt.advice)}</p>
        <ul>${findingItems}</ul>
        <div class="actions">
          <button class="btn-leave" data-cloak-action="leave">&#x2190; Leave this page</button>
          <div class="row">
            <button class="btn-report" data-cloak-action="copy">Copy receipt to report</button>
          </div>
          <button class="btn-hide" data-cloak-action="dismiss">Hide warning (I understand the risk)</button>
        </div>
      </div>
    `;

    root.addEventListener('click', async (event) => {
      const action = event.target?.dataset?.cloakAction;
      if (action === 'dismiss') {
        root.remove();
        unblockPageInputs();
        showPersistentStrip(receipt);
      }
      if (action === 'leave') {
        if (history.length > 1) history.back();
        else location.href = 'about:blank';
      }
      if (action === 'copy') {
        await navigator.clipboard?.writeText(formatReceipt(receipt));
        event.target.textContent = 'Copied! Share with your bank or authorities.';
        setTimeout(() => { event.target.textContent = 'Copy receipt to report'; }, 3000);
      }
    });

    document.documentElement.appendChild(root);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function formatReceipt(receipt) {
    const lines = [
      'CLOAK STING - SCAM WARNING RECEIPT',
      '------------------------------------',
      `Verdict: ${verdictText(receipt.risk)} (${receipt.score}/100)`,
      `Page: ${receipt.title || receipt.hostname}`,
      `URL: ${receipt.url}`,
      `Advice: ${receipt.advice}`,
      '',
      'Warning signals:',
    ];
    for (const finding of receipt.findings) lines.push(`  - ${finding.label}: ${finding.evidence}`);
    lines.push('');
    lines.push('WHAT TO DO:');
    lines.push('  - Do NOT send money, gift cards, or crypto');
    lines.push('  - Report to your bank if you shared financial info');
    lines.push('  - File a report: reportfraud.ftc.gov or ic3.gov');
    lines.push('  - Tell a family member or friend');
    lines.push('');
    lines.push(`Captured: ${receipt.analyzedAt || new Date().toISOString()}`);
    return lines.join('\n');
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
      <span class="warn-icon">\u26A0\uFE0F</span>Sting: Suspicious link \u2014 ${safeReason}
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
