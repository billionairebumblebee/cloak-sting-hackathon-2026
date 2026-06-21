# sting product surfaces plan

## Current hackathon truth

The current submitted product surface is a Chrome extension because it can actually read the webpage DOM and interrupt the user at the danger moment. This is the fastest truthful ambient demo.

Core loop:

screen/webpage surface -> scam signal detection -> warning bubble/overlay -> receipt -> case dossier

## Bubble / overlay behavior

The bubble should feel like a calm bodyguard, not an alarm.

States:

1. Quiet watch
   - small cloak/ray bubble in the corner
   - no interruption on low-risk pages

2. Soft concern
   - medium risk: bubble expands with "slow down" language
   - offers "inspect link" and "save receipt"

3. Hard stop
   - high risk: overlay card blocks the form/payment area visually
   - copy: "Pause before you type, pay, or call."
   - actions: Copy receipt, Inspect in isolation, Report/save case, Dismiss

4. Receipt mode
   - shows observed signals only
   - separates evidence from inference
   - exports family/bank/authority dossier

## Screen reading by platform

### Chrome extension now

Best for hackathon.

Can read:
- DOM text
- inputs/placeholders/buttons/links
- URL/domain/title
- page structure

Cannot reliably read:
- arbitrary native apps
- SMS outside browser
- phone calls/voicemails unless uploaded/forwarded

### Android later

Best future full-screen product.

Use Accessibility Service + overlay permission.

Can potentially detect:
- SMS apps
- browser pages
- payment apps at risky moments
- copied text
- suspicious UI phrases

Risks:
- privacy/trust burden
- Play Store review sensitivity
- must make permissions very transparent

### iOS later

No continuous arbitrary screen reading for normal apps.

Realistic iOS routes:
- Safari extension for webpages
- Share Sheet: user shares suspicious page/message to Cloak
- SMS filter extension for known scam patterns
- email forwarding/import
- voicemail/audio upload for Deepgram path

### Desktop app later

Could use local screen/OCR/accessibility, but higher trust and install friction. Better as pro/family-protection dashboard after browser MVP.

## Deepgram voice path

Voice scams are a first-class surface, not polish.

Flow:

voicemail/audio -> Deepgram transcript/language detection -> scam detector -> ransom/pressure rubric -> receipt/dossier

Priority scenarios:
- fake hostage/ransom calls
- Mandarin/Chinese-language family scams
- bank/fraud department robocalls
- shipping/customs fee voicemails

## Browserbase path

Browserbase is not the user surface. It is the safe sandbox.

Flow:

user sees suspicious link -> Cloak opens isolated Browserbase session -> extracts title/text/signals -> generates receipt without exposing user browser/device

Pitch line: "Cloak can inspect the link in isolation before grandma touches it."

## Product positioning

Do not pitch this as a chatbot.

Pitch as:
- ambient intervention
- calm warning bubble
- evidence receipt
- case memory
- family/bank/authority reporting rail

The wedge is: "protect before the mistake, preserve proof after the attempt."
