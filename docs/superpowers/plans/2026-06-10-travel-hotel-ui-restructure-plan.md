# Travel Hotel UI Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Aurora Hotel hero cover the full viewport width and give each capability channel its own hotel scene background.

**Architecture:** Preserve the existing Flask/Jinja, static export, CSS, and plain JavaScript structure. Add a dedicated capability background layer whose image is controlled by the existing `CAP_CHANNELS` data, while giving the hero a page-specific full-width rule that does not affect other bleed sections.

**Tech Stack:** Jinja/HTML, CSS custom properties, plain JavaScript, Python `unittest`, local browser verification.

---

### Task 1: Add Failing Static Validation

**Files:**
- Modify: `tests/test_travel_hotel_demo.py`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Replace the single clean-background assertion with channel-background assertions**

Update `test_capability_console_hooks_and_asset_exist` so it checks for the new background layer and existing scene assets:

```python
        for hook in [
            "sol-cap-console",
            "sol-cap-console__background",
            "sol-cap-channel",
            "data-cap-channel=\"app\"",
            "data-cap-channel=\"webpush\"",
            "data-cap-channel=\"sms\"",
            "data-cap-channel=\"whatsapp\"",
            "data-cap-channel=\"email\"",
            "data-cap-channel=\"ma\"",
            "data-cap-channel=\"livedesk\"",
            "data-cap-channel=\"agent\"",
            "sol-cap-dashboard",
            "sol-cap-phone",
            "sol-cap-journey",
        ]:
            with self.subTest(hook=hook):
                self.assertIn(hook, template)

        for image_name in [
            "cap-deluxe-suite.png",
            "cap-executive-suite.png",
            "cap-lobby-entrance.png",
            "cap-pool.png",
            "cap-hotel-wedding.png",
        ]:
            with self.subTest(image_name=image_name):
                self.assertTrue((ROOT / "static/imgs" / image_name).exists())
                self.assertTrue((ROOT / "docs/static/imgs" / image_name).exists())
```

- [ ] **Step 2: Add explicit CSS and JavaScript behavior assertions**

Add a new test:

```python
    def test_channel_backgrounds_and_full_width_hero_are_wired(self):
        template = self.read("templates/solutions/travel-hotel.html")
        css = self.read("static/css/solution-travel-hotel.css")
        js = self.read("static/js/solution-travel-hotel.js")

        self.assertIn("sol-cap-console__background", template)
        self.assertIn(".sol-hero--cover.sol-bleed", css)
        self.assertIn("padding-left: 0", css)
        self.assertIn("padding-right: 0", css)
        self.assertIn(".sol-cap-console__background", css)
        self.assertIn("var(--sol-cap-bg)", css)
        self.assertIn("prefers-reduced-motion: reduce", css)

        for image_name in [
            "cap-deluxe-suite.png",
            "cap-executive-suite.png",
            "cap-lobby-entrance.png",
            "cap-pool.png",
            "cap-hotel-wedding.png",
        ]:
            with self.subTest(image_name=image_name):
                self.assertIn(image_name, js)

        self.assertIn('style.setProperty("--sol-cap-bg"', js)
        self.assertNotIn("aurora-hotel-clean-background.png", template)
```

- [ ] **Step 3: Update docs export assertions**

Require the docs page to contain the new layer and omit the old capability background:

```python
        self.assertIn("sol-cap-console__background", docs_html)
        self.assertNotIn("aurora-hotel-clean-background.png", docs_html)
```

- [ ] **Step 4: Run the test and verify RED**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
```

Expected: FAIL because the background layer, image mappings, and full-width hero rules do not exist yet.

### Task 2: Add Channel-Specific Background Behavior

**Files:**
- Modify: `static/js/solution-travel-hotel.js`
- Modify: `docs/static/js/solution-travel-hotel.js`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Add a background value to every channel**

Add `background` beside `journeyStep` in each `CAP_CHANNELS` entry:

```javascript
background: "../imgs/cap-deluxe-suite.png",
```

Use this mapping:

```text
app       -> cap-deluxe-suite.png
webpush   -> cap-executive-suite.png
sms       -> cap-lobby-entrance.png
whatsapp  -> cap-pool.png
email     -> cap-hotel-wedding.png
ma        -> cap-pool.png
livedesk  -> cap-lobby-entrance.png
agent     -> cap-deluxe-suite.png
```

- [ ] **Step 2: Update the console custom property in `setChannelPanel`**

After resolving `data` and `root`, add:

```javascript
    var consoleEl = document.getElementById("sol-cap-console");
    if (consoleEl && data.background) {
      consoleEl.style.setProperty("--sol-cap-bg", 'url("' + data.background + '")');
    }
```

- [ ] **Step 3: Sync the JavaScript export**

Copy the same source changes into `docs/static/js/solution-travel-hotel.js`, preserving the relative `../imgs/` paths because both CSS/JS directories have the same relationship to their image directories.

- [ ] **Step 4: Run the focused tests**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo.TravelHotelDemoTest.test_channel_backgrounds_and_full_width_hero_are_wired
```

Expected: still FAIL on missing HTML/CSS hooks, but no longer fail on JavaScript image mappings or `style.setProperty`.

### Task 3: Restructure Hero And Capability Markup

**Files:**
- Modify: `templates/solutions/travel-hotel.html`
- Modify: `docs/solutions/travel-hotel/index.html`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Remove the inline capability background**

Change the template console opening from:

```html
<div
  class="sol-cap-console"
  id="sol-cap-console"
  style="--sol-cap-bg: url('{{ url_for('static', filename='imgs/aurora-hotel-clean-background.png') }}')"
>
```

to:

```html
<div class="sol-cap-console" id="sol-cap-console">
  <div class="sol-cap-console__background" aria-hidden="true"></div>
```

Keep `.sol-cap-console__scrim` immediately after the new background layer.

- [ ] **Step 2: Apply the same markup to the docs export**

Use:

```html
<div class="sol-cap-console" id="sol-cap-console">
  <div class="sol-cap-console__background" aria-hidden="true"></div>
```

Remove the `aurora-hotel-clean-background.png` inline style.

- [ ] **Step 3: Run template-focused tests**

Run:

```bash
python3 -m unittest \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_capability_console_hooks_and_asset_exist \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_docs_export_is_synced
```

Expected: PASS for the markup and asset assertions; the full suite still fails until CSS is implemented.

### Task 4: Implement Full-Width Hero And Background Layer Styling

**Files:**
- Modify: `static/css/solution-travel-hotel.css`
- Modify: `docs/static/css/solution-travel-hotel.css`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Remove generic bleed padding from the hero only**

Add after the `.sol-hero--cover` rule:

```css
.sol-hero--cover.sol-bleed {
  padding-left: 0;
  padding-right: 0;
}
```

This preserves the text padding on `.sol-hero__inner` while allowing the background and scrim to reach both viewport edges.

- [ ] **Step 2: Move capability imagery to a dedicated layer**

Replace the image portion of `.sol-cap-console` with a solid fallback:

```css
.sol-cap-console {
  background: #172018;
}
```

Add:

```css
.sol-cap-console__background {
  position: absolute;
  inset: 0;
  background-color: #172018;
  background-image: var(--sol-cap-bg, url("../imgs/cap-deluxe-suite.png"));
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: scale(1.015);
  transition: opacity 0.24s ease;
}
```

Keep `.sol-cap-console__scrim` above the background layer and `.sol-cap-console__inner` at `z-index: 1`.

- [ ] **Step 3: Respect reduced motion**

Add:

```css
@media (prefers-reduced-motion: reduce) {
  .sol-cap-console__background {
    transition: none;
  }
}
```

- [ ] **Step 4: Sync the CSS export**

Apply the identical rules to `docs/static/css/solution-travel-hotel.css`.

- [ ] **Step 5: Run all static tests and verify GREEN**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
```

Expected: all tests PASS.

### Task 5: Browser And Regression Verification

**Files:**
- Verify: `templates/solutions/travel-hotel.html`
- Verify: `static/css/solution-travel-hotel.css`
- Verify: `static/js/solution-travel-hotel.js`
- Verify: `docs/solutions/travel-hotel/index.html`

- [ ] **Step 1: Start the local Flask app**

Run:

```bash
python3 app.py
```

Expected: the server starts at `http://127.0.0.1:5001`.

- [ ] **Step 2: Verify desktop layout**

Open `http://127.0.0.1:5001/solutions/travel-hotel` at a desktop viewport and confirm:

```text
Hero image reaches the left and right viewport edges.
Hero text remains centered with readable padding.
Capability console initially shows the deluxe-suite background.
Clicking WebPush changes the background to executive-suite.
Clicking WhatsApp changes the background to pool.
Clicking Email changes the background to hotel-wedding.
Dashboard, phone, and journey content still update with each channel.
```

- [ ] **Step 3: Verify mobile layout**

At a viewport near `390 x 844`, confirm:

```text
No horizontal overflow.
Hero remains edge-to-edge.
Channel buttons remain usable.
Dashboard cards remain readable over every background.
```

- [ ] **Step 4: Run final verification**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
git diff --check
```

Expected: tests PASS and `git diff --check` exits with no output.
