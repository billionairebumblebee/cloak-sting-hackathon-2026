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
      analyzedAt: new Date().toISOString(),
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

  function riskColor(risk) {
    if (risk === 'high') return { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', text: '#ef4444', glow: 'rgba(239,68,68,0.3)' };
    if (risk === 'medium') return { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', text: '#f59e0b', glow: 'rgba(245,158,11,0.3)' };
    return { bg: 'rgba(34,197,94,0.12)', border: '#22c55e', text: '#22c55e', glow: 'rgba(34,197,94,0.3)' };
  }

  function renderOverlay(receipt) {
    removeExistingOverlay();
    if (receipt.score < MIN_VISIBLE_SCORE) return;

    const colors = riskColor(receipt.risk);
    const root = document.createElement('section');
    root.id = 'cloak-sting-overlay';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-label', 'Scam warning from Cloak Sting');
    root.setAttribute('aria-describedby', 'cloak-sting-advice');

    const findingItems = receipt.findings
      .slice(0, 4)
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
          background: rgba(13,13,15,0.96);
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
          margin-bottom: 12px;
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
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        #cloak-sting-overlay .risk-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 14px;
          padding: 8px 14px;
          border-radius: 999px;
          background: ${colors.bg};
          color: ${colors.text};
          border: 1.5px solid ${colors.border};
          font-weight: 800;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 0.06em;
        }
        #cloak-sting-overlay .advice {
          font-size: 16px;
          line-height: 1.5;
          margin: 0 0 14px;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border-left: 3px solid #8b5cf6;
          color: #e5e5e7;
        }
        #cloak-sting-overlay ul {
          margin: 0 0 16px;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }
        #cloak-sting-overlay li {
          display: grid;
          gap: 3px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
        }
        #cloak-sting-overlay li strong {
          font-size: 14px;
          font-weight: 700;
          color: #f5f5f7;
        }
        #cloak-sting-overlay li span {
          color: #a1a1a6;
          font-size: 13px;
          word-break: break-word;
          line-height: 1.4;
        }
        #cloak-sting-overlay .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        #cloak-sting-overlay button {
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 44px;
        }
        #cloak-sting-overlay button:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
        #cloak-sting-overlay .primary {
          background: #8b5cf6;
          color: white;
          flex: 1;
        }
        #cloak-sting-overlay .primary:hover { background: #7c3aed; }
        #cloak-sting-overlay .ghost {
          background: rgba(255,255,255,0.08);
          color: #e5e5e7;
          border: 1px solid rgba(255,255,255,0.1);
        }
        #cloak-sting-overlay .ghost:hover { background: rgba(255,255,255,0.12); }
      </style>
      <div class="bar"></div>
      <div class="inner">
        <div class="header">
          <div class="shield" aria-hidden="true">&#x1F6E1;</div>
          <h2>Warning: Possible Scam</h2>
        </div>
        <div class="risk-badge">&#x26A0; ${escapeHtml(receipt.risk)} risk &middot; ${receipt.score}/100</div>
        <p class="advice" id="cloak-sting-advice">${escapeHtml(receipt.advice)}</p>
        <ul>${findingItems}</ul>
        <div class="actions">
          <button class="primary" data-cloak-action="copy">Copy Warning</button>
          <button class="ghost" data-cloak-action="dismiss">Dismiss</button>
        </div>
      </div>
    `;

    root.addEventListener('click', async (event) => {
      const action = event.target?.dataset?.cloakAction;
      if (action === 'dismiss') root.remove();
      if (action === 'copy') {
        await navigator.clipboard?.writeText(formatReceipt(receipt));
        event.target.textContent = 'Copied!';
        setTimeout(() => { event.target.textContent = 'Copy Warning'; }, 2000);
      }
    });

    document.documentElement.appendChild(root);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function formatReceipt(receipt) {
    const lines = [
      'CLOAK STING — SCAM WARNING',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `Risk: ${receipt.risk.toUpperCase()} (${receipt.score}/100)`,
      `Page: ${receipt.title || receipt.hostname}`,
      `URL: ${receipt.url}`,
      `Advice: ${receipt.advice}`,
      '',
      'Warning signals:',
    ];
    for (const finding of receipt.findings) lines.push(`  • ${finding.label}: ${finding.evidence}`);
    lines.push('', 'Share this with your bank, family, or local authorities if needed.');
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
