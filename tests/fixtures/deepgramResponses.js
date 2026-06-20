/**
 * Mocked Deepgram API responses for testing.
 * No real audio is required — these simulate the JSON returned by POST /v1/listen.
 */

const hostageRansomResponse = {
  metadata: {
    request_id: 'mock-req-hostage-001',
    duration: 42.5,
    channels: 1,
    model_info: { name: 'nova-3', version: '2026.06' }
  },
  results: {
    channels: [
      {
        detected_language: 'en',
        alternatives: [
          {
            transcript: 'We have your son. Do not call the police. Wire the money to this bitcoin wallet within two hours or he will be harmed. Pay the ransom now. We are watching your house.',
            confidence: 0.94,
            words: [
              { word: 'We', start: 0.0, end: 0.15, confidence: 0.99 },
              { word: 'have', start: 0.16, end: 0.30, confidence: 0.98 },
              { word: 'your', start: 0.31, end: 0.45, confidence: 0.97 },
              { word: 'son.', start: 0.46, end: 0.70, confidence: 0.96 },
              { word: 'Do', start: 0.80, end: 0.90, confidence: 0.99 },
              { word: 'not', start: 0.91, end: 1.05, confidence: 0.99 },
              { word: 'call', start: 1.06, end: 1.25, confidence: 0.98 },
              { word: 'the', start: 1.26, end: 1.35, confidence: 0.99 },
              { word: 'police.', start: 1.36, end: 1.70, confidence: 0.97 }
            ]
          }
        ]
      }
    ],
    summary: { short: 'Caller demands ransom payment for an alleged hostage.' }
  }
};

const bankRobocallResponse = {
  metadata: {
    request_id: 'mock-req-bank-002',
    duration: 28.3,
    channels: 1,
    model_info: { name: 'nova-3', version: '2026.06' }
  },
  results: {
    channels: [
      {
        detected_language: 'en',
        alternatives: [
          {
            transcript: 'This is an urgent notice from your bank security fraud department. Your account has been suspended due to unauthorized activity. To verify your identity, press 1 now. Have your social security number and credit card number ready. Act now or your account will be permanently locked.',
            confidence: 0.91,
            words: [
              { word: 'This', start: 0.0, end: 0.18, confidence: 0.99 },
              { word: 'is', start: 0.19, end: 0.28, confidence: 0.99 },
              { word: 'an', start: 0.29, end: 0.35, confidence: 0.98 },
              { word: 'urgent', start: 0.36, end: 0.60, confidence: 0.97 },
              { word: 'notice', start: 0.61, end: 0.85, confidence: 0.96 }
            ]
          }
        ]
      }
    ],
    summary: { short: 'Automated bank security call requesting personal details.' }
  }
};

const chineseScamResponse = {
  metadata: {
    request_id: 'mock-req-chinese-003',
    duration: 35.7,
    channels: 1,
    model_info: { name: 'nova-3', version: '2026.06' }
  },
  results: {
    channels: [
      {
        detected_language: 'zh',
        alternatives: [
          {
            transcript: '您好，这里是中国大使馆。您的护照涉嫌犯罪活动，公安局已发出逮捕令。请立即配合调查，将资金转账到安全账户，否则将被拘留。请不要挂断电话。',
            confidence: 0.88,
            words: [
              { word: '您好', start: 0.0, end: 0.4, confidence: 0.95 },
              { word: '这里是', start: 0.5, end: 0.9, confidence: 0.93 },
              { word: '中国大使馆', start: 1.0, end: 1.8, confidence: 0.90 }
            ]
          }
        ]
      }
    ],
    summary: { short: 'Caller impersonates Chinese embassy, threatens arrest, demands fund transfer.' }
  }
};

const cleanConversationResponse = {
  metadata: {
    request_id: 'mock-req-clean-004',
    duration: 15.0,
    channels: 1,
    model_info: { name: 'nova-3', version: '2026.06' }
  },
  results: {
    channels: [
      {
        detected_language: 'en',
        alternatives: [
          {
            transcript: 'Hey, are we still on for dinner tonight? I was thinking we could try that new Italian place downtown.',
            confidence: 0.97,
            words: [
              { word: 'Hey', start: 0.0, end: 0.2, confidence: 0.99 }
            ]
          }
        ]
      }
    ]
  }
};

module.exports = {
  hostageRansomResponse,
  bankRobocallResponse,
  chineseScamResponse,
  cleanConversationResponse
};
