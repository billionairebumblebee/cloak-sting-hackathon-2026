#!/usr/bin/env node

/**
 * ASI:One / Agentverse agent demo — starts the local agent server
 * and runs a sample scam analysis request.
 *
 * Usage:
 *   node scripts/asi_agent_demo.js
 *   ASI_AGENT_PORT=9000 node scripts/asi_agent_demo.js
 */

const { agentInfo, createAgentServer } = require('../src/asiOneWrapper.js');

async function main() {
  console.log('=== sting — ASI:One Agent Demo ===\n');

  const info = agentInfo();
  console.log('Agent info:');
  console.log(`  Name:     ${info.name}`);
  console.log(`  Protocol: ${info.protocol}`);
  console.log(`  Version:  ${info.version}`);
  console.log(`  Registered on Agentverse: ${info.registeredOnAgentverse}\n`);

  const { server, port } = createAgentServer();
  await new Promise((resolve) => server.listen(port, resolve));
  const addr = server.address();
  console.log(`Agent server running on http://127.0.0.1:${addr.port}\n`);

  console.log('--- GET /info ---');
  const infoRes = await fetch(`http://127.0.0.1:${addr.port}/info`);
  console.log(JSON.stringify(await infoRes.json(), null, 2));

  console.log('\n--- POST /analyze (high-risk scam page) ---');
  const analyzeRes = await fetch(`http://127.0.0.1:${addr.port}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://secure-login-verify.example.zip',
      title: 'Bank Security - Verify Now',
      text: 'Your account is locked. Act now to verify. Wire transfer $500 required. Do not tell anyone about this verification.'
    })
  });
  const result = await analyzeRes.json();
  console.log(`Risk: ${result.receipt.risk} (${result.receipt.score}/100)`);
  console.log(`Findings: ${result.receipt.findings.length}`);
  console.log(`Brand: ${result.caseRecord.suspectedBrand}`);
  console.log(`Case ID: ${result.caseRecord.id}`);

  console.log('\n--- POST /analyze (benign page) ---');
  const safeRes = await fetch(`http://127.0.0.1:${addr.port}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://news.example.com/weather',
      text: 'Today will be sunny with a high of 75 degrees.'
    })
  });
  const safeResult = await safeRes.json();
  console.log(`Risk: ${safeResult.receipt.risk} (${safeResult.receipt.score}/100)`);

  server.close();
  console.log('\nAgent server stopped. Demo complete.');
}

main().catch((err) => {
  console.error('ASI agent demo error:', err.message);
  process.exitCode = 1;
});
