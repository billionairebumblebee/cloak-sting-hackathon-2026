const crypto = require('node:crypto');

/* ── Plain-language mappings ── */

const SIGNAL_PLAIN = {
  'Fake bank login page': 'This site pretends to be your bank so it can steal your login.',
  'Urgency pressure': 'The page tries to rush you into acting before you can think.',
  'Asks for SSN': 'The site asks for your Social Security number — a real company would never do this in a link.',
  'Unusual payment request': 'They ask you to pay in an unusual way, like gift cards or crypto.',
  'Trusted institution language': 'The page uses the name of a real company or government agency to trick you.',
  'Isolation / secrecy pressure': 'They tell you not to talk to anyone else — a major red flag.',
  'Hostage / ransom threat': 'They threaten that someone you love is in danger to scare you into paying.',
  'Crypto credential harvesting': 'They want your secret wallet words so they can steal your money.',
  'Brand impersonation pattern': 'The website address is designed to look like a trusted brand.',
  'Security-language domain': 'The website address uses words like "secure" or "verify" to seem real.',
  'Risky novelty top-level domain': 'The website uses an unusual address ending that scammers often pick.',
  'Repeated credential/code request': 'They keep asking for passwords and codes — a sign they are harvesting your info.',
  'Social engineering tactic': 'They use tricks to keep you on the line and stop you from checking.',
  'Possible AI deepfake/robocall indicator': 'This may be a computer-generated voice pretending to be a real person.',
  'Chinese-language scam signal': 'This contains language patterns commonly used in phone scams.',
  'Hyphen-stuffed domain': 'The website address has many dashes, which is a common scam trick.'
};

const RISK_PLAIN = {
  high: 'HIGH — This is very likely a scam. Do not enter any information.',
  medium: 'MEDIUM — Something looks off. Be very careful before doing anything.',
  low: 'LOW — No strong warning signs, but always stay cautious.'
};

const WHAT_THEY_WANTED_MAP = {
  credential: 'your login username and password',
  payment: 'a payment (gift cards, wire transfer, or crypto)',
  impersonation: 'your trust by pretending to be a real company',
  pressure: 'to isolate you so nobody can warn you',
  ransom: 'money by threatening someone you love',
  'crypto-harvest': 'your secret wallet recovery phrase',
  copy: 'you to panic and act without thinking',
  domain: 'you to visit a fake website that looks real',
  deepfake: 'you to believe a fake voice or caller',
  'social-engineering': 'to keep you on the line so you can\'t check',
  'chinese_scam': 'your personal details using common phone-scam tactics',
  'form-harvest': 'your personal information through a fake form'
};

const ACTION_TIPS = {
  high: [
    'Do NOT enter any information on that site.',
    'Close the page or turn off the device if needed.',
    'Call your bank directly using the number on your card — not a number from the suspicious site.',
    'Tell a family member or someone you trust what happened.',
    'Report to the FTC at reportfraud.ftc.gov'
  ],
  medium: [
    'Do not enter any personal information yet.',
    'Look up the company\'s real phone number yourself and call them to check.',
    'Ask a family member or friend to look at the page with you.',
    'If it asks for payment by gift card, wire, or crypto — it is a scam.',
    'Report anything suspicious at reportfraud.ftc.gov'
  ],
  low: [
    'Stay cautious — if something feels off, trust your gut.',
    'Never share passwords, Social Security numbers, or bank PINs by email or text.',
    'When in doubt, call the company directly using a number you already trust.'
  ]
};

function packetId() {
  return `rescue_${crypto.randomBytes(6).toString('hex')}`;
}

function plainSignal(label) {
  return SIGNAL_PLAIN[label] || label;
}

function inferWhatTheyWanted(findings) {
  const types = new Set(findings.map((f) => f.type));
  const items = [];
  for (const [type, desc] of Object.entries(WHAT_THEY_WANTED_MAP)) {
    if (types.has(type)) items.push(desc);
  }
  if (items.length === 0) items.push('your personal information');
  return items;
}

function plainWhatHappened(scanResult) {
  const site = scanResult.hostname || 'a suspicious website';
  const risk = (scanResult.risk || 'unknown').toLowerCase();

  if (risk === 'high') {
    const types = new Set((scanResult.findings || []).map((f) => f.type));
    if (types.has('credential') || types.has('crypto-harvest')) {
      return `Your family member visited a website (${site}) that is trying to steal their login information or secret codes.`;
    }
    if (types.has('payment')) {
      return `Your family member visited a website (${site}) that is trying to trick them into sending money.`;
    }
    if (types.has('ransom')) {
      return `Your family member received a frightening message from ${site} that is trying to scare them into sending money.`;
    }
    return `Your family member visited a website (${site}) that shows strong signs of being a scam.`;
  }
  if (risk === 'medium') {
    return `Your family member visited a website (${site}) that has some warning signs. It may be trying to steal personal information.`;
  }
  return `Your family member visited a website (${site}). No strong scam signals were detected, but it is good to stay alert.`;
}

function generateFamilyPacket(scanResult) {
  const findings = scanResult.findings || [];
  const risk = (scanResult.risk || 'low').toUpperCase();
  const hostname = scanResult.hostname || 'unknown website';

  const seen = new Set();
  const signalsDetected = [];
  for (const f of findings) {
    const plain = plainSignal(f.label);
    if (!seen.has(plain)) {
      seen.add(plain);
      signalsDetected.push(plain);
      if (signalsDetected.length >= 6) break;
    }
  }

  const whatTheyWanted = inferWhatTheyWanted(findings);
  const riskKey = (scanResult.risk || 'low').toLowerCase();
  const whatToDo = ACTION_TIPS[riskKey] || ACTION_TIPS.low;

  const shareTarget = whatTheyWanted[0] || 'personal information';
  const shareableMessage = risk === 'LOW'
    ? `STING checked ${hostname} and found no strong warning signs. Stay cautious anyway.`
    : `\u26A0\uFE0F STING blocked a scam targeting your family member. The site ${hostname} was trying to get ${shareTarget}. Do NOT enter any info. ${whatToDo[0]}`;

  return {
    id: packetId(),
    createdAt: new Date().toISOString(),
    whatHappened: plainWhatHappened(scanResult),
    riskLevel: risk,
    whatTheyWanted: `The scammers wanted: ${whatTheyWanted.join(', ')}`,
    signalsDetected,
    whatToDo,
    siteBlocked: hostname,
    shareableMessage
  };
}

function formatPacketPlainText(packet) {
  const lines = [
    '========================================',
    '  STING — Family Rescue Packet',
    '========================================',
    '',
    `Risk level: ${packet.riskLevel}`,
    '',
    'WHAT HAPPENED',
    `  ${packet.whatHappened}`,
    '',
    'WHAT THEY WANTED',
    `  ${packet.whatTheyWanted}`,
    '',
    'WARNING SIGNS WE FOUND'
  ];
  for (const signal of packet.signalsDetected) {
    lines.push(`  • ${signal}`);
  }
  lines.push('', 'WHAT TO DO NOW');
  for (let i = 0; i < packet.whatToDo.length; i++) {
    lines.push(`  ${i + 1}. ${packet.whatToDo[i]}`);
  }
  lines.push(
    '',
    'SITE BLOCKED',
    `  ${packet.siteBlocked}`,
    '',
    '----------------------------------------',
    'SHAREABLE MESSAGE (copy and send to family):',
    '',
    `  ${packet.shareableMessage}`,
    '',
    '----------------------------------------',
    `Packet ID: ${packet.id}`,
    `Created: ${packet.createdAt}`,
    '',
    'This packet was generated by STING to help',
    'you understand and respond to a potential scam.',
    '========================================'
  );
  return lines.join('\n');
}

function formatPacketHTML(packet) {
  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  const riskColors = {
    HIGH: { bg: '#fef3c7', border: '#f59e0b', badge: '#d97706', badgeBg: '#fde68a' },
    MEDIUM: { bg: '#eff6ff', border: '#3b82f6', badge: '#2563eb', badgeBg: '#bfdbfe' },
    LOW: { bg: '#f0fdf4', border: '#22c55e', badge: '#16a34a', badgeBg: '#bbf7d0' }
  };
  const colors = riskColors[packet.riskLevel] || riskColors.MEDIUM;

  const signalItems = packet.signalsDetected
    .map((s) => `<li style="padding:6px 0;border-bottom:1px solid #f0f0f0;color:#374151">${esc(s)}</li>`)
    .join('');

  const actionItems = packet.whatToDo
    .map((a, i) => `<li style="padding:6px 0;color:#374151"><strong>${i + 1}.</strong> ${esc(a)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>STING Family Rescue Packet</title>
</head>
<body style="margin:0;padding:20px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;border:2px solid ${colors.border};overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

  <div style="background:${colors.bg};padding:20px 24px;border-bottom:1px solid ${colors.border}">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span style="font-size:28px">\uD83D\uDEE1\uFE0F</span>
      <span style="font-size:20px;font-weight:700;color:#111827">STING Family Rescue</span>
    </div>
    <span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${colors.badgeBg};color:${colors.badge};font-weight:700;font-size:13px;letter-spacing:0.04em">${esc(packet.riskLevel)} RISK</span>
  </div>

  <div style="padding:20px 24px">
    <h3 style="margin:0 0 8px;color:#111827;font-size:16px">\uD83D\uDCA1 What happened</h3>
    <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.5">${esc(packet.whatHappened)}</p>

    <h3 style="margin:0 0 8px;color:#111827;font-size:16px">\uD83C\uDFAF What they wanted</h3>
    <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.5">${esc(packet.whatTheyWanted)}</p>

    <h3 style="margin:0 0 8px;color:#111827;font-size:16px">\u26A0\uFE0F Warning signs we found</h3>
    <ul style="margin:0 0 20px;padding:0;list-style:none">${signalItems}</ul>

    <h3 style="margin:0 0 8px;color:#111827;font-size:16px">\u2705 What to do now</h3>
    <ol style="margin:0 0 20px;padding:0;list-style:none">${actionItems}</ol>

    <div style="background:#f3f4f6;border-radius:12px;padding:16px;margin-bottom:16px">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600">BLOCKED SITE</p>
      <p style="margin:0;font-size:14px;color:#dc2626;font-weight:600;word-break:break-all">${esc(packet.siteBlocked)}</p>
    </div>

    <div style="background:${colors.bg};border:1px solid ${colors.border};border-radius:12px;padding:16px">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:600">SHAREABLE MESSAGE</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.5" id="share-msg">${esc(packet.shareableMessage)}</p>
    </div>
  </div>

  <div style="padding:16px 24px;border-top:1px solid #e5e7eb;display:flex;gap:10px;flex-wrap:wrap">
    <button onclick="navigator.clipboard.writeText(document.getElementById('share-msg').textContent).then(function(){this.textContent='Copied!'}.bind(this))" style="flex:1;min-width:140px;padding:12px;border:none;border-radius:10px;background:${colors.badge};color:#fff;font-weight:700;font-size:14px;cursor:pointer">\uD83D\uDCCB Copy to clipboard</button>
    <button onclick="location.href='sms:?body='+encodeURIComponent(document.getElementById('share-msg').textContent)" style="flex:1;min-width:140px;padding:12px;border:2px solid ${colors.border};border-radius:10px;background:#fff;color:${colors.badge};font-weight:700;font-size:14px;cursor:pointer">\uD83D\uDCF1 Share via text</button>
  </div>

  <div style="padding:12px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af">
    Packet ${esc(packet.id)} &middot; ${esc(packet.createdAt)}
  </div>

</div>
</body>
</html>`;
}

function validatePacket(packet, original) {
  const issues = [];

  if (!packet.id || !packet.id.startsWith('rescue_')) {
    issues.push('Missing or malformed packet ID');
  }
  if (!packet.createdAt) {
    issues.push('Missing creation timestamp');
  }
  if (!packet.whatHappened) {
    issues.push('Missing whatHappened description');
  }
  if (!['HIGH', 'MEDIUM', 'LOW'].includes(packet.riskLevel)) {
    issues.push('Invalid risk level');
  }

  const origRisk = (original.risk || 'low').toUpperCase();
  if (packet.riskLevel !== origRisk) {
    issues.push(`Risk level mismatch: packet says ${packet.riskLevel}, original says ${origRisk}`);
  }

  const origFindings = original.findings || [];
  if (origFindings.length > 0 && packet.signalsDetected.length === 0) {
    issues.push('Original had findings but packet has no signals — critical info lost');
  }

  if (!packet.siteBlocked && original.hostname) {
    issues.push('Blocked site info was lost');
  }

  if (!packet.shareableMessage) {
    issues.push('Missing shareable message');
  }

  return {
    valid: issues.length === 0,
    issues,
    signalCoverage: origFindings.length > 0
      ? Math.round((packet.signalsDetected.length / Math.min(origFindings.length, 6)) * 100)
      : 100
  };
}

module.exports = { generateFamilyPacket, formatPacketPlainText, formatPacketHTML, validatePacket };
