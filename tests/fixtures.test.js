const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScamSurface } = require('../src/scamSignals.js');

// ---------------------------------------------------------------------------
// High-risk fixture tests — each demo page should trigger high risk
// ---------------------------------------------------------------------------

test('romance scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    title: 'Your Special Connection - Secure Gift Portal',
    text: 'Hi darling, I am stuck overseas and my accounts are frozen. I need you to send money urgently so I can buy a plane ticket to finally meet you. Wire transfer is the fastest way please act now before the ticket price goes up. Do not tell your family or friends about this. Keep this confidential between us. Send 2500 via gift card or Zelle. Limited time offer verify now! Only through this page can you help your loved one. Do not contact anyone else about this transfer.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.type === 'payment'));
  assert.ok(result.findings.some((f) => f.type === 'pressure'));
});

test('fake tech support fixture → high risk', () => {
  const result = analyzeScamSurface({
    hostname: 'microsoft-support-alert.click',
    title: 'Microsoft Support - Critical Virus Alert',
    text: 'URGENT: We have detected a critical virus on your system. Your account has been suspended. Call our Microsoft Support team immediately. Do not contact any other support only through this page. Provide your password and one-time security code. Our Apple Support verification center requires this. Processing fee of 299 required. Pay via gift card or crypto. Final notice: act now within 24 hours.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.type === 'impersonation'));
  assert.ok(result.findings.some((f) => f.type === 'credential'));
  assert.ok(result.findings.some((f) => f.label.includes('novelty top-level domain')));
});

test('crypto investment scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    title: 'CryptoVault Elite - Guaranteed Returns',
    text: 'Join thousands earning 500 percent returns with our exclusive bitcoin trading algorithm. Act now limited time offer. Deposit in crypto or bitcoin. Wire transfer also accepted. Urgent: verify now. Keep this confidential. Do not tell others. Cash App and Zelle deposits accepted.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.evidence === 'bitcoin'));
  assert.ok(result.findings.some((f) => f.evidence === 'crypto'));
});

test('customs fee scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    hostname: 'dhl-customs-payment.top',
    title: 'DHL Express - Customs Fee Required',
    text: 'Your shipment has been held at customs. A customs fee must be paid immediately. Final notice: processing fee required within 24 hours. Redelivery fee via secure form. FedEx and DHL partner verification center. Do not contact DHL directly. Only through this page. Ignore other messages.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.evidence === 'customs fee'));
  assert.ok(result.findings.some((f) => f.evidence === 'dhl'));
});

test('bank OTP scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    hostname: 'secure-login-bank-verify.example',
    title: 'Bank Security - OTP Verification Required',
    text: 'URGENT: Suspicious activity detected. Your account has been suspended. Verify now with one-time code OTP and password. Account locked. Bank security fraud department. Do not contact your local branch. Avoid calling. Final notice act now immediately.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.type === 'domain'));
  assert.ok(result.findings.some((f) => f.evidence === 'bank security'));
  assert.ok(result.findings.some((f) => f.evidence === 'fraud department'));
});

test('fake hostage/ransom fixture → high risk', () => {
  const result = analyzeScamSurface({
    title: 'Urgent Family Emergency',
    text: 'We have your daughter. Do not tell anyone. Do not contact the police. Keep this confidential. Send 5000 in bitcoin within 24 hours. Wire transfer via Zelle or Cash App. Act now. Final notice. Only through this page. Ignore other messages.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.type === 'payment'));
  assert.ok(result.findings.some((f) => f.type === 'pressure'));
  assert.ok(result.findings.filter((f) => f.type === 'pressure').length >= 3);
});

test('Chinese-language family scam fixture → high risk', () => {
  const result = analyzeScamSurface({
    title: '紧急通知 - 家庭安全验证',
    text: 'Urgent: Your son is detained overseas. Wire transfer of 8000 required immediately for bail. Act now do not tell other family members. Keep this confidential. Gift card or Zelle accepted. Do not contact the embassy. Only through this page. Avoid calling. Ignore other messages. Password for verification.'
  });
  assert.equal(result.risk, 'high');
  assert.ok(result.score >= 65);
  assert.ok(result.findings.some((f) => f.type === 'payment'));
  assert.ok(result.findings.some((f) => f.type === 'pressure'));
});

// ---------------------------------------------------------------------------
// Medium-risk edge cases — partial signals, not enough for high
// ---------------------------------------------------------------------------

test('subtle romance message → medium risk with gift card mention + urgency', () => {
  const result = analyzeScamSurface({
    title: 'Message from your match',
    text: 'I really need your help urgently. Please send a gift card so I can pay for my medical bills. Act now before it is too late. I love you.'
  });
  assert.equal(result.risk, 'medium');
  assert.ok(result.score >= 35 && result.score < 65);
});

test('vague crypto pitch → medium risk with some payment terms', () => {
  const result = analyzeScamSurface({
    title: 'New Investment Group',
    text: 'Earn great returns on bitcoin investments. Send crypto to join. Limited time offer for premium members.'
  });
  assert.equal(result.risk, 'medium');
  assert.ok(result.score >= 35 && result.score < 65);
});

test('partial shipping pressure → medium risk', () => {
  const result = analyzeScamSurface({
    title: 'Package Notification',
    text: 'Your package requires a customs fee to be released. Pay the processing fee now. DHL express delivery.'
  });
  assert.equal(result.risk, 'medium');
  assert.ok(result.score >= 35 && result.score < 65);
});

// ---------------------------------------------------------------------------
// Low-risk benign pages — should not trigger false positives
// ---------------------------------------------------------------------------

test('legitimate banking site → low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'www.chase.com',
    title: 'Chase Online Banking',
    text: 'Welcome to Chase. Check your balance, pay bills, and manage accounts.'
  });
  assert.equal(result.risk, 'low');
  assert.ok(result.score < 35);
});

test('normal e-commerce checkout → low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'www.amazon.com',
    title: 'Amazon.com Shopping Cart',
    text: 'Your cart contains 3 items. Proceed to checkout. Free shipping on orders over 25 dollars.'
  });
  assert.equal(result.risk, 'low');
  assert.ok(result.score < 35);
});

test('news article → low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'www.bbc.com',
    title: 'BBC News - World',
    text: 'Latest headlines. Technology, science, health, and world news coverage from our correspondents around the globe.'
  });
  assert.equal(result.risk, 'low');
  assert.equal(result.findingCount, 0);
});

test('personal blog → low risk', () => {
  const result = analyzeScamSurface({
    hostname: 'myblog.example.com',
    title: 'Weekend Recipe: Homemade Pasta',
    text: 'This weekend I tried making fresh pasta from scratch. Here is the recipe and some photos from the kitchen.'
  });
  assert.equal(result.risk, 'low');
  assert.equal(result.findingCount, 0);
});

// ---------------------------------------------------------------------------
// Signal-type coverage tests
// ---------------------------------------------------------------------------

test('all scam signal categories are covered across fixtures', () => {
  const allFixtures = [
    { title: 'Romance', text: 'wire transfer gift card do not tell keep this confidential act now urgent' },
    { hostname: 'secure-verify.click', title: 'Tech', text: 'microsoft support verification center password one-time code processing fee crypto immediately final notice do not contact only through this page' },
    { title: 'Ransom', text: 'bitcoin zelle cash app within 24 hours do not tell keep this confidential ignore other messages' },
  ];
  const allTypes = new Set();
  for (const fixture of allFixtures) {
    const result = analyzeScamSurface(fixture);
    for (const f of result.findings) allTypes.add(f.type);
  }
  assert.ok(allTypes.has('copy'), 'should detect urgency copy');
  assert.ok(allTypes.has('payment'), 'should detect payment signals');
  assert.ok(allTypes.has('pressure'), 'should detect secrecy pressure');
  assert.ok(allTypes.has('impersonation'), 'should detect impersonation');
  assert.ok(allTypes.has('credential'), 'should detect credential harvesting');
  assert.ok(allTypes.has('domain'), 'should detect risky domains');
});
