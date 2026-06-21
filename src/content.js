(() => {
  const STORAGE_KEY = 'stingLatestReceipt';
  const HISTORY_KEY = 'stingScanHistory';
  const FAMILY_RECEIPTS_KEY = 'familyReceipts';
  const HISTORY_LIMIT = 25;
  const MIN_VISIBLE_SCORE = 55;
  const BLOCK_SCORE = 70;

  const ALLOWLISTED_DOMAINS = [
    'cloak-sting-hackathon-2026.vercel.app',
    'localhost',
    '127.0.0.1',
    'github.com',
    'docs.google.com',
    'slides.google.com',
    'drive.google.com',
    'mail.google.com',
    'google.com',
    'youtube.com',
    'stackoverflow.com',
    'notion.so',
    'figma.com',
    'vercel.app',
    'netlify.app',
    'linkedin.com',
    'twitter.com',
    'x.com',
    'discord.com',
    'slack.com',
    'reddit.com',
    'wikipedia.org',
    'amazon.com',
    'microsoft.com',
    'apple.com',
    'devpost.com',
    'npmjs.com',
    'gitlab.com',
    'bitbucket.org',
  ];

  if (ALLOWLISTED_DOMAINS.some((d) => location.hostname === d || location.hostname.endsWith('.' + d))) {
    return;
  }

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

  function buildFamilyReceipt(receipt) {
    const topSignals = (receipt.findings || []).slice(0, 5).map((f) => ({
      signal: f.label,
      evidence: f.evidence
    }));
    return {
      id: `family-${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: receipt.url,
      hostname: receipt.hostname,
      threatLevel: receipt.risk || 'unknown',
      score: receipt.score,
      topSignals,
      summary: `STING detected a ${receipt.risk || 'unknown'}-risk scam on ${receipt.hostname}. ${verdictText(receipt.risk)}.`,
      safeNextSteps: [
        'Do NOT enter any personal information on this site',
        'Do NOT send money, gift cards, or cryptocurrency',
        'Report to your bank if you shared financial info',
        'File a report at reportfraud.ftc.gov or ic3.gov',
        'Close this page and do not return'
      ]
    };
  }

  function saveFamilyReceipt(receipt) {
    const familyReceipt = buildFamilyReceipt(receipt);
    try {
      if (globalThis.chrome?.storage?.local) {
        chrome.storage.local.get(FAMILY_RECEIPTS_KEY, (result) => {
          const receipts = result[FAMILY_RECEIPTS_KEY] || [];
          receipts.unshift(familyReceipt);
          if (receipts.length > HISTORY_LIMIT) receipts.length = HISTORY_LIMIT;
          chrome.storage.local.set({ [FAMILY_RECEIPTS_KEY]: receipts });
        });
      } else {
        let receipts = [];
        try { receipts = JSON.parse(localStorage.getItem(FAMILY_RECEIPTS_KEY) || '[]'); } catch (_) {}
        receipts.unshift(familyReceipt);
        if (receipts.length > HISTORY_LIMIT) receipts.length = HISTORY_LIMIT;
        localStorage.setItem(FAMILY_RECEIPTS_KEY, JSON.stringify(receipts));
      }
    } catch (_) {}
  }

  function formatFamilyReceipt(receipt) {
    const fr = buildFamilyReceipt(receipt);
    const lines = [
      'STING — Family Rescue Receipt',
      '====================================',
      '',
      `Date: ${fr.timestamp}`,
      `Site blocked: ${fr.hostname}`,
      `URL: ${fr.url}`,
      `Threat level: ${fr.threatLevel.toUpperCase()}`,
      '',
      `Summary: ${fr.summary}`,
      '',
      'SIGNALS DETECTED:'
    ];
    for (const s of fr.topSignals) lines.push(`  - ${s.signal}: ${s.evidence}`);
    lines.push('', 'SAFE NEXT STEPS:');
    for (const step of fr.safeNextSteps) lines.push(`  - ${step}`);
    lines.push('', 'This receipt was generated by STING scam protection.', 'Share this with a trusted family member or friend for help.');
    return lines.join('\n');
  }

  function removeExistingOverlay() {
    document.getElementById('sting-overlay')?.remove();
  }

  function blockPageInputs() {
    if (document.getElementById('sting-input-shield')) return;
    const shield = document.createElement('div');
    shield.id = 'sting-input-shield';
    shield.innerHTML = `
      <style>
        #sting-input-shield {
          position: fixed;
          inset: 0;
          z-index: 2147483646;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          cursor: not-allowed;
          animation: stingShieldIn 0.3s ease-out;
        }
        @keyframes stingShieldIn {
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
    document.getElementById('sting-input-shield')?.remove();
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
    const existing = document.getElementById('sting-strip');
    if (existing) return;
    const colors = riskColor(receipt.risk);
    const strip = document.createElement('div');
    strip.id = 'sting-strip';
    strip.innerHTML = `
      <style>
        #sting-strip {
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
          animation: stingStripIn 0.2s ease-out;
        }
        @keyframes stingStripIn {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        #sting-strip .strip-text { font-weight: 700; }
        #sting-strip button {
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
        #sting-strip button:hover { opacity: 0.85; }
      </style>
      <span class="strip-text">\u26A0 This page was flagged: ${escapeHtml(verdictText(receipt.risk))}</span>
      <button data-sting-strip="show">Show warning</button>
    `;
    strip.addEventListener('click', (e) => {
      if (e.target?.dataset?.stingStrip === 'show') {
        strip.remove();
        renderOverlay(receipt);
      }
    });
    document.documentElement.appendChild(strip);
  }

  function disablePageForms() {
    document.querySelectorAll('input, textarea, select, button:not([data-sting-action])').forEach((el) => {
      if (!el.closest('#sting-overlay') && !el.closest('#sting-strip')) {
        el.dataset.stingDisabled = el.disabled ? 'was-disabled' : 'enabled';
        el.disabled = true;
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  function enablePageForms() {
    document.querySelectorAll('[data-sting-disabled]').forEach((el) => {
      if (el.dataset.stingDisabled === 'enabled') {
        el.disabled = false;
        el.removeAttribute('tabindex');
      }
      delete el.dataset.stingDisabled;
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
    root.id = 'sting-overlay';
    root.setAttribute('role', 'alertdialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Scam warning from sting');
    root.setAttribute('aria-describedby', 'sting-advice');
    root.setAttribute('tabindex', '-1');

    const findingItems = receipt.findings
      .slice(0, 4)
      .map((f) => `<li><strong>${escapeHtml(f.label)}</strong><span>${escapeHtml(f.evidence)}</span></li>`)
      .join('');

    root.innerHTML = `
      <style>
        #sting-overlay{position:fixed;right:18px;top:18px;z-index:2147483647;width:min(420px,calc(100vw - 36px));font:1.125rem/1.45 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#e8e8e8;background:rgba(8,8,12,.96);border:1px solid rgba(245,166,35,.25);box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 40px rgba(245,166,35,.08);border-radius:22px;overflow:hidden;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        #sting-overlay .bar{height:5px;background:linear-gradient(90deg,#f5a623,#9333ea,#f5a623)}
        #sting-overlay .inner{padding:18px}
        #sting-overlay h2{margin:0 0 10px;font-size:1.375rem;letter-spacing:-.02em;color:#f5a623;text-shadow:0 0 12px rgba(245,166,35,.3)}
        #sting-overlay .risk{display:inline-flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 14px;border-radius:999px;background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.4);color:#fca5a5;font-weight:700;text-transform:uppercase;font-size:0.875rem;letter-spacing:.06em;box-shadow:0 0 10px rgba(220,38,38,.15)}
        #sting-overlay p{margin:0 0 13px;color:#aaa;font-size:1.0625rem}
        #sting-overlay ul{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:8px}
        #sting-overlay li{display:grid;gap:2px;padding:12px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
        #sting-overlay li strong{font-size:0.9375rem;color:#e8e8e8}
        #sting-overlay li span{color:#888;font-size:0.8125rem;word-break:break-word}
        #sting-overlay .actions{display:flex;gap:10px;flex-wrap:wrap}
        #sting-overlay button{border:0;border-radius:999px;padding:14px 20px;font-size:1rem;font-weight:700;cursor:pointer;min-height:44px;min-width:44px;transition:all .2s}
        #sting-overlay .primary{background:linear-gradient(135deg,#f5a623,#e09000);color:#050505;box-shadow:0 2px 8px rgba(245,166,35,.2)}
        #sting-overlay .primary:hover{box-shadow:0 0 16px rgba(245,166,35,.4);transform:translateY(-1px)}
        #sting-overlay .danger{background:rgba(220,38,38,.12);color:#fca5a5;border:1px solid rgba(220,38,38,.3)}
        #sting-overlay .danger:hover{background:rgba(220,38,38,.2);box-shadow:0 0 12px rgba(220,38,38,.2)}
        #sting-overlay .ghost{background:rgba(255,255,255,.04);color:#999;border:1px solid rgba(255,255,255,.08)}
        #sting-overlay .ghost:hover{background:rgba(255,255,255,.08);color:#e8e8e8}
        #sting-overlay .family{background:rgba(147,51,234,.12);color:#c4b5fd;border:1px solid rgba(147,51,234,.3)}
        #sting-overlay .family:hover{background:rgba(147,51,234,.2);box-shadow:0 0 12px rgba(147,51,234,.2)}
        #sting-overlay .family-confirm{margin-top:10px;padding:12px 14px;border-radius:14px;background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.18);animation:stingFamilyIn .3s ease-out}
        @keyframes stingFamilyIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        #sting-overlay .family-confirm p{margin:0 0 8px;font-size:0.875rem;color:#86efac;font-weight:600}
        #sting-overlay .family-confirm .copy-receipt{background:linear-gradient(135deg,#f5a623,#e09000);color:#050505;border:none;border-radius:999px;padding:10px 18px;font-size:0.8125rem;font-weight:700;cursor:pointer;transition:all .2s}
        #sting-overlay .family-confirm .copy-receipt:hover{box-shadow:0 0 14px rgba(245,166,35,.4);transform:translateY(-1px)}
      </style>
      <div class="bar"></div>
      <div class="inner">
        <h2>\u{1F6E1} Stop \u2014 ${verdictText(receipt.risk).toLowerCase()}</h2>
        <div class="risk">\u26A0 ${escapeHtml(receipt.risk)} risk</div>
        <p style="font-size:1rem;color:#888;margin:0 0 10px">You haven\u2019t done anything wrong. You\u2019re safe as long as you don\u2019t type anything here.</p>
        <p style="font-size:15px;line-height:1.5;color:#ccc" id="sting-advice">${escapeHtml(receipt.advice)}</p>
        <ul>${findingItems}</ul>
        <div class="actions">
          <button class="danger" data-sting-action="leave">\u2190 Take me somewhere safe</button>
          <button class="primary" data-sting-action="copy">Save proof for my bank or family</button>
          <button class="family" data-sting-action="family">\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67 Send to Family</button>
          <button class="ghost" data-sting-action="dismiss">Hide warning (I understand the risk)</button>
        </div>
      </div>
    `;

    root.addEventListener('click', async (event) => {
      const action = event.target?.dataset?.stingAction;
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
      if (action === 'family') {
        saveFamilyReceipt(receipt);
        const actionsDiv = root.querySelector('.actions');
        const existingConfirm = root.querySelector('.family-confirm');
        if (!existingConfirm && actionsDiv) {
          const confirmDiv = document.createElement('div');
          confirmDiv.className = 'family-confirm';
          confirmDiv.innerHTML = '<p>\u2705 Receipt saved. Share this with someone you trust.</p><button class="copy-receipt" data-sting-action="copy-family">Copy receipt to clipboard</button>';
          actionsDiv.insertAdjacentElement('afterend', confirmDiv);
        }
        event.target.textContent = '\u2705 Saved!';
        setTimeout(() => { event.target.textContent = '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67 Send to Family'; }, 3000);
      }
      if (action === 'copy-family') {
        const plainText = formatFamilyReceipt(receipt);
        await navigator.clipboard?.writeText(plainText);
        event.target.textContent = '\u2705 Copied!';
        setTimeout(() => { event.target.textContent = 'Copy receipt to clipboard'; }, 3000);
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
      'sting — scam warning receipt',
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

  /* ── Reporting panel (inline authority routing for browser context) ── */

  const INLINE_AUTHORITIES = {
    FTC: { name: 'FTC (Federal Trade Commission)', url: 'https://reportfraud.ftc.gov', howToFile: 'Visit reportfraud.ftc.gov, click "Report Now", and follow the guided questionnaire.' },
    IC3: { name: 'FBI IC3 (Internet Crime Complaint Center)', url: 'https://www.ic3.gov', howToFile: 'Go to ic3.gov, click "File a Complaint", and complete the online form.' },
    CFPB: { name: 'CFPB (Consumer Financial Protection Bureau)', url: 'https://www.consumerfinance.gov/complaint/', howToFile: 'Submit a complaint at consumerfinance.gov/complaint.' },
    FCC: { name: 'FCC (Federal Communications Commission)', url: 'https://consumercomplaints.fcc.gov', howToFile: 'File a complaint at consumercomplaints.fcc.gov under "Phone".' },
    SEC: { name: 'SEC (Securities and Exchange Commission)', url: 'https://www.sec.gov/tcr', howToFile: 'Submit a tip at sec.gov/tcr with details of the investment fraud.' },
    CFTC: { name: 'CFTC (Commodity Futures Trading Commission)', url: 'https://www.cftc.gov/complaint', howToFile: 'File at cftc.gov/complaint for crypto or commodity fraud.' },
    IDENTITY_THEFT: { name: 'IdentityTheft.gov', url: 'https://www.identitytheft.gov', howToFile: 'Visit identitytheft.gov to report and get a recovery plan.' },
    CARRIER_7726: { name: 'Forward to 7726 (SPAM)', url: '', howToFile: 'Forward the suspicious text to 7726. Your carrier will investigate.' },
  };

  const INLINE_BRAND_URLS = {
    google: { name: 'Google Abuse Report', url: 'https://safebrowsing.google.com/safebrowsing/report_phish/' },
    apple: { name: 'Apple Phishing Report', url: 'https://support.apple.com/en-us/102568' },
    amazon: { name: 'Amazon Fraud Report', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G508510' },
    microsoft: { name: 'Microsoft Phishing Report', url: 'https://www.microsoft.com/en-us/concern/scam' },
    paypal: { name: 'PayPal Fraud Report', url: 'https://www.paypal.com/us/security/report-suspicious-messages' },
    usps: { name: 'USPS Fraud Report', url: 'https://www.uspis.gov/report' },
    fedex: { name: 'FedEx Fraud Report', url: 'https://www.fedex.com/en-us/trust-center/report-fraud.html' },
    dhl: { name: 'DHL Fraud Report', url: 'https://www.dhl.com/us-en/home/footer/fraud-awareness.html' },
  };

  function getChannelsForReceipt(receipt) {
    const findings = receipt.findings || [];
    const types = new Set();
    for (const f of findings) {
      if (f.type) types.add(f.type);
      const ev = (f.evidence || '').toLowerCase();
      if (/crypto|bitcoin|wallet|seed phrase|private key/.test(ev)) types.add('crypto');
      if (/bank|financial/.test((f.label || '').toLowerCase())) types.add('financial');
      if (/phone|call/.test(ev)) types.add('phone');
      if (/romance|dating/.test(ev)) types.add('romance');
      if (/identity|credential|ssn/.test(ev)) types.add('identity');
    }

    const channels = [INLINE_AUTHORITIES.FTC, INLINE_AUTHORITIES.IC3];
    if (types.has('financial') || types.has('impersonation') || types.has('payment')) channels.push(INLINE_AUTHORITIES.CFPB);
    if (types.has('phone') || types.has('ransom') || types.has('social-engineering') || types.has('deepfake')) {
      channels.push(INLINE_AUTHORITIES.FCC);
      channels.push(INLINE_AUTHORITIES.CARRIER_7726);
    }
    if (types.has('crypto') || types.has('crypto-harvest')) {
      channels.push(INLINE_AUTHORITIES.SEC);
      channels.push(INLINE_AUTHORITIES.CFTC);
    }
    if (types.has('romance')) channels.push({ name: 'FBI IC3 Romance Fraud Unit', url: 'https://www.ic3.gov', howToFile: 'File at ic3.gov and select "Romance Scam" as the crime type.' });
    if (types.has('identity') || types.has('credential')) channels.push(INLINE_AUTHORITIES.IDENTITY_THEFT);

    const hostname = (receipt.hostname || '').toLowerCase();
    for (const [brand, info] of Object.entries(INLINE_BRAND_URLS)) {
      if (hostname.includes(brand)) channels.push(info);
    }

    return channels;
  }

  function buildPlainTextReport(receipt, channels) {
    const lines = [
      '========================================',
      '  STING — Scam Report for Authorities',
      '========================================',
      '',
      `Generated: ${new Date().toISOString()}`,
      `URL:       ${receipt.url}`,
      `Hostname:  ${receipt.hostname}`,
      `Risk:      ${receipt.risk} (${receipt.score}/100)`,
      '',
      '--- WARNING SIGNALS ---',
    ];
    for (const f of (receipt.findings || [])) {
      lines.push(`  - [${f.type}] ${f.label}: ${f.evidence}`);
    }
    lines.push('', '--- RECOMMENDED REPORTING CHANNELS ---');
    for (const ch of channels) {
      lines.push(`  ${ch.name}${ch.url ? ' — ' + ch.url : ''}`);
    }
    lines.push('', 'DISCLAIMER: This report was generated by STING scam detection software. Evidence has not been verified by law enforcement.');
    lines.push('========================================');
    return lines.join('\n');
  }

  function showReportingPanel(receipt) {
    document.getElementById('sting-report-panel')?.remove();
    const channels = getChannelsForReceipt(receipt);
    const panel = document.createElement('div');
    panel.id = 'sting-report-panel';

    const channelListHtml = channels.map((ch) => {
      const linkHtml = ch.url
        ? `<a href="${escapeHtml(ch.url)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;word-break:break-all">${escapeHtml(ch.url)}</a>`
        : '<span style="color:#888">No URL — see instructions</span>';
      return `<div style="padding:12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);margin-bottom:8px">
        <div style="font-weight:700;font-size:14px;color:#e8e8e8;margin-bottom:4px">${escapeHtml(ch.name)}</div>
        <div style="font-size:12px;margin-bottom:4px">${linkHtml}</div>
        <div style="font-size:12px;color:#999">${escapeHtml(ch.howToFile)}</div>
      </div>`;
    }).join('');

    panel.innerHTML = `
      <style>
        #sting-report-panel{position:fixed;right:18px;top:18px;z-index:2147483647;width:min(440px,calc(100vw - 36px));max-height:calc(100vh - 36px);overflow-y:auto;font:14px/1.45 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif;color:#e8e8e8;background:rgba(8,8,12,.97);border:1px solid rgba(147,51,234,.35);box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 40px rgba(147,51,234,.1);border-radius:22px;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        #sting-report-panel .rp-bar{height:5px;background:linear-gradient(90deg,#9333ea,#6366f1,#9333ea)}
        #sting-report-panel .rp-inner{padding:18px}
        #sting-report-panel h3{margin:0 0 6px;font-size:18px;color:#c084fc}
        #sting-report-panel .rp-disclaimer{font-size:11px;color:#888;margin:12px 0 0;padding:10px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
        #sting-report-panel button{border:0;border-radius:999px;padding:12px 18px;font-size:13px;font-weight:700;cursor:pointer;min-height:44px;transition:all .2s}
        #sting-report-panel .rp-copy{background:linear-gradient(135deg,#9333ea,#7c22ce);color:#fff;margin-right:8px}
        #sting-report-panel .rp-copy:hover{box-shadow:0 0 16px rgba(147,51,234,.4)}
        #sting-report-panel .rp-close{background:rgba(255,255,255,.06);color:#999;border:1px solid rgba(255,255,255,.1)}
        #sting-report-panel .rp-close:hover{color:#e8e8e8;background:rgba(255,255,255,.1)}
      </style>
      <div class="rp-bar"></div>
      <div class="rp-inner">
        <h3>\u{1F4E2} Report This Scam</h3>
        <p style="color:#aaa;font-size:13px;margin:0 0 14px">Based on the scam signals detected, here are the recommended authorities to report to:</p>
        ${channelListHtml}
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">
          <button class="rp-copy" data-sting-report="copy">Copy report to clipboard</button>
          <button class="rp-close" data-sting-report="close">Close</button>
        </div>
        <div class="rp-disclaimer">STING does not submit reports on your behalf. These are official channels where you can file your own report.</div>
      </div>
    `;

    const plainReport = buildPlainTextReport(receipt, channels);
    panel.addEventListener('click', async (e) => {
      const action = e.target?.dataset?.stingReport;
      if (action === 'close') panel.remove();
      if (action === 'copy') {
        await navigator.clipboard?.writeText(plainReport);
        e.target.textContent = '\u2705 Copied!';
        setTimeout(() => { e.target.textContent = 'Copy report to clipboard'; }, 3000);
      }
    });

    document.documentElement.appendChild(panel);
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

  const TOOLTIP_ID = 'sting-link-tooltip';
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
