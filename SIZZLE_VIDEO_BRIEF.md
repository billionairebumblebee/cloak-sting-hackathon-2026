# cloak STING — Sizzle Video Generation Brief

**STING = Scam Tracking & Intelligence Network Guard**

Ready-to-run creative brief for a 15-second cinematic app teaser using Pika Seedance.

---

## Assets (5 references)

| Ref | File | Description |
|-----|------|-------------|
| @Image1 | User-provided screenshot: "Protection active" calm state | Dark popup, green dot, STING v0.3.0 header with stingray icon, 4 detection modules showing LIVE/READY badges, stat cards at 0 |
| @Image2 | User-provided screenshot: "Threat detected" alert state | Same dark popup, red dot, "Threat detected" text, www.en.bgk.pl target, 2 PAGES SCANNED / 1 THREATS FOUND in red |
| @Image3 | User-provided screenshot: THREATS tab with signal details | MEDIUM badge, amber progress bar, "Looks suspicious" verdict, 3 signal cards (Urgency pressure, Trusted institution language — irs, Repeated credential/code request — 5 terms), "WHAT TO DO" advisory |
| @Image4 | User-provided screenshot: "Stop – looks suspicious" dark overlay | Dark card with stingray icon, red MEDIUM RISK badge, calm reassurance text, 3 signal cards, 3 action buttons: red "Take me somewhere safe" / amber "Save proof for my bank or family" / dark "Hide warning" |
| @Image5 | `screenshots/sting-logo-stingray.jpeg` | White stingray silhouette with "STING" wordmark on white background (invert for black bg end card) |

Note: Screenshots from batches 1 and 2 were provided directly by the user during the session. They should be uploaded to Pika MCP before generation.

---

## Stage 1 — Feature Map

```
Screen 1 — "Protection active": Dark popup panel with amber STING header, green status dot,
  four detection module rows (Pattern engine, DOM scanner, Form interceptor = LIVE green,
  Voice pipeline = READY amber), stat cards at zero. Represents: ambient guardian at rest.
  Moment: Hook. Visual character: dark, minimal, green accents.

Screen 2 — "Threat detected": Same panel layout but status dot flipped red, target URL
  visible (www.en.bgk.pl), stat cards showing 2 scanned / 1 threat in red. Represents:
  real-time alert state change. Moment: Build A. Visual character: red alarm on dark.

Screen 3 — "WHY WE'RE WORRIED": THREATS tab with orange MEDIUM badge, amber gradient
  progress bar, "Looks suspicious" verdict text, three signal cards with alarm/mask icons
  (Urgency pressure, Trusted institution language — irs, Repeated credential/code request),
  "WHAT TO DO" advisory text. Represents: intelligence breakdown. Moment: Build B.
  Visual character: amber/orange signal cards, completely different layout.

Screen 4 — "Stop – looks suspicious": Dark overlay card with stingray icon header, red
  MEDIUM RISK badge, calm text ("You haven't done anything wrong. You're safe as long as
  you don't type anything here."), large advisory ("Slow down before continuing. Your real
  bank will never ask for your password by email. Call the number on your card."), three
  signal cards, three action buttons (red/amber/dark). Represents: user-facing protective
  intervention. Moment: Reveal. Visual character: dark card with red/amber/cream buttons.

Screen 5 — Stingray logo: White stingray silhouette with two dot eyes and barbed tail,
  "STING" wordmark in spaced caps. Represents: brand identity. Moment: Logo lock.
  Visual character: minimal, iconic.
```

---

## Stage 2 — Narrative Arc

```
Arc type: Journey (calm → alert → intelligence → protection → brand)

Hook (0–3s): Screen 1 — extreme macro close-up on the green "Protection active" dot
  and STING wordmark with stingray icon, detection modules pulsing LIVE. The bodyguard
  is awake. Camera drifts slowly across the LIVE badges.

Build A (3–7s): Screen 2 — crash zoom as the dot flips red, "Threat detected" appears,
  target URL resolves to www.en.bgk.pl, threat counter visible at 1. The calm breaks.

Build B (7–11s): Screen 3 — whip pan to THREATS tab. Signal cards cascade in one by one:
  Urgency pressure, Trusted institution language, Repeated credential request. The amber
  progress bar fills. The intelligence layer explains why.

Reveal (11–13s): Screen 4 — push-in drift on the dark overlay card. "Stop – looks
  suspicious." Red MEDIUM RISK badge glows. Action buttons materialize: "Take me somewhere
  safe" / "Save proof for my bank or family" / "Hide warning." The protection moment.

Logo (13–15s): Screen 5 — hard cut to black. White stingray silhouette materializes
  whole in a burst of amber-gold light, "STING" wordmark fades in beneath. Holds.
  COMING SOON added as post-generation text overlay.
```

---

## Stage 3 — Seedance Prompt

```
Cinematic ad. Digital bodyguard: calm and lethal. Pure black background.

BEAT 1 (Hook, 0–3s): Extreme macro close-up — @Image1 is a dark popup panel with amber
"STING v0.3.0" header and stingray icon, green "Protection active" status dot, four
detection module rows showing green dots and "LIVE" badges in emerald, stat cards reading
"0 PAGES SCANNED / 0 THREATS FOUND." Camera drifts slowly across the LIVE badges.

BEAT 2 (Build A, 3–7s): Crash zoom — @Image2 is the same dark panel but the status dot
has flipped red with "Threat detected" text, current target reads "www.en.bgk.pl", stat
cards show "2 PAGES SCANNED" and "1 THREATS FOUND" in red. The calm turns sharp.

BEAT 3 (Build B, 7–11s): Whip pan to — @Image3 is the THREATS tab with an orange
"MEDIUM" badge, amber progress bar, "Looks suspicious" verdict, and three signal cards
with alarm icons: "Urgency pressure," "Trusted institution language — irs," "Repeated
credential/code request — 5 credential terms," followed by "WHAT TO DO" advisory.

BEAT 4 (Reveal, 11–13s): Push-in drift — @Image4 is a dark overlay card reading "Stop –
looks suspicious" with a red "MEDIUM RISK" badge, calm text "You haven't done anything
wrong," three signal cards, and three action buttons: red "Take me somewhere safe,"
amber-outlined "Save proof for my bank or family," dark "Hide warning."

BEAT 5 (Logo, 13–15s): Hard cut to black — @Image5 is the STING stingray silhouette
and wordmark in white. It materializes whole in a burst of amber-gold light and holds.

Style: dark cinematic thriller, self-luminous UI on absolute black, amber-gold and emerald
accents. No text rendered in motion.
```

---

## Generation Parameters

```python
generate_reference_video(
    provider="seedance",
    reference_images=["<url1>", "<url2>", "<url3>", "<url4>", "<url5>"],
    prompt="<prompt above>",
    resolution="1080p",
    duration=15,
    sound=True,
    aspect_ratio="16:9",
    seed=42,
)
```

### Fallback (if Seedance fails)

```python
generate_reference_video(
    provider="kling",
    reference_images=["<url1>", "<url2>", "<url3>", "<url4>", "<url5>"],
    prompt="<prompt converted to <<<image_N>>> tokens>",
    quality_mode="pro",
    duration=15,
    sound=True,
    aspect_ratio="16:9",
)
```

---

## Post-Generation

Apply deterministic COMING SOON overlay:

```python
edit_text_overlay(
    video_url=<generated_teaser_url>,
    text="COMING SOON",
    position="bottom_center",
    font_size=56,
    font_color="white",
    start_s=13,
    end_s=15,
)
```

---

## Brand Context

- **cloak** = lowercase parent brand
- **STING** = uppercase product name (Scam Tracking & Intelligence Network Guard)
- Tone: calm, premium, protective, direct
- Palette: black / amber-gold / emerald / cream
- Aesthetic: "cute face, barbed tail" — a stingray guardian
- Tagline options: "Not today." / "The scam stops before the click." / "Soft life. Hard perimeter."
- Truth boundary: hackathon prototype, not a deployed product
