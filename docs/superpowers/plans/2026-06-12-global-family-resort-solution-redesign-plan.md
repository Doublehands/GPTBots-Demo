# Global Family Resort Solution Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Aurora Hotel travel solution page as a cinematic five-scene demo that explains proactive EngageLab engagement, GPTBots intelligent concierge service, Livedesk human assurance, and the complete pre-stay/in-stay/post-stay guest journey.

**Architecture:** Keep the existing Flask/Jinja page, plain CSS, plain JavaScript, Livedesk widget, and static docs export. Replace the mixed capability console with three isolated data-driven interaction modules (`TOUCHPOINT_CHANNELS`, `CONCIERGE_MODES`, and `GUEST_JOURNEY`), each owning one semantic tab interface and one DOM region. Use generated photography only as clean scene backgrounds; render every control, label, message, and status in HTML/CSS.

**Tech Stack:** Flask, Jinja2, semantic HTML, CSS custom properties, vanilla JavaScript, Python `unittest`, Node.js syntax/data harnesses, built-in image generation, in-app Browser verification.

---

## File Map

### Source Of Truth

- Modify `templates/solutions/travel-hotel.html`: five-scene document structure, accessible controls, fallback content, Livedesk widget, booking modal, and closing CTA.
- Replace `static/css/solution-travel-hotel.css`: scene layout, overlay readability, tab controls, console surfaces, responsive states, focus styles, and reduced-motion behavior.
- Replace `static/js/solution-travel-hotel.js`: three data collections, shared tab controller, scene renderers, progress navigation, booking modal, and optional lightbox support.
- Modify `tests/test_travel_hotel_demo.py`: architecture, copy, assets, accessibility hooks, module data, export synchronization, and brand-safety regression tests.

### New Scene Assets

- Create `static/imgs/resort-hero-family-v2.png`: opening global family-resort image.
- Create `static/imgs/resort-engagement-family-v2.png`: EngageLab journey-engagement scene.
- Create `static/imgs/resort-concierge-lobby-v2.png`: wide intelligent-concierge lobby.
- Create `static/imgs/journey-prestay-family-v2.png`: pre-stay planning scene.
- Create `static/imgs/journey-instay-family-v2.png`: in-stay resort activity/service scene.
- Create `static/imgs/journey-poststay-family-v2.png`: post-stay family memory/loyalty scene.

### Static Export

- Replace `docs/solutions/travel-hotel/index.html`: rendered standalone page.
- Replace `docs/static/css/solution-travel-hotel.css`: byte-for-byte copy of source CSS.
- Replace `docs/static/js/solution-travel-hotel.js`: byte-for-byte copy of source JavaScript.
- Create the six matching files under `docs/static/imgs/`.

### Explicitly Out Of Scope

- Do not modify `docs/gptbots-aurora-hotel-customer-service-agentflow.html`.
- Do not modify `docs/gptbots-aurora-hotel-customer-service-agentflow.md`.
- Do not modify the global `base.html` layout or unrelated solution pages.
- Do not delete unrelated existing images; stop referencing obsolete travel-hotel images from this page instead.

---

### Task 1: Lock The Five-Scene Contract With Failing Tests

**Files:**
- Modify: `tests/test_travel_hotel_demo.py`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Replace legacy console assertions with five-scene architecture assertions**

Replace `test_template_positions_aurora_hotel_solution`, `test_capability_console_hooks_and_asset_exist`, and `test_channel_backgrounds_and_full_width_hero_are_wired` with:

```python
    def test_template_has_approved_five_scene_architecture_in_order(self):
        template = self.read("templates/solutions/travel-hotel.html")
        section_ids = [
            'id="resort-hero"',
            'id="engagement-hub"',
            'id="concierge-lobby"',
            'id="guest-journey"',
            'id="group-value"',
        ]

        positions = [template.index(section_id) for section_id in section_ids]
        self.assertEqual(positions, sorted(positions))

        required_copy = [
            "Aurora Hotel",
            "全球化家庭度假集团全旅程智能服务解决方案",
            "主动触达",
            "24 小时智能管家",
            "人工护航",
            "EngageLab",
            "GPTBots",
            "Livedesk",
            "住前",
            "住中",
            "住后",
        ]
        for text in required_copy:
            with self.subTest(text=text):
                self.assertIn(text, template)

        for legacy_id in [
            'id="capabilities"',
            'id="livedesk-arch"',
            'id="journey"',
            'id="build-ai-agent"',
        ]:
            with self.subTest(legacy_id=legacy_id):
                self.assertNotIn(legacy_id, template)

        self.assertNotIn("sol-bg__orb", template)

    def test_engagement_and_lobby_controls_have_strict_product_boundaries(self):
        template = self.read("templates/solutions/travel-hotel.html")

        engagement = template[
            template.index('id="engagement-hub"') : template.index('id="concierge-lobby"')
        ]
        expected_channels = ["app", "webpush", "sms", "whatsapp", "email", "ma"]
        actual_channels = re.findall(r'data-touchpoint="([^"]+)"', engagement)
        self.assertEqual(actual_channels, expected_channels)
        self.assertNotIn('data-touchpoint="agent"', engagement)
        self.assertNotIn('data-touchpoint="livedesk"', engagement)

        lobby = template[
            template.index('id="concierge-lobby"') : template.index('id="guest-journey"')
        ]
        actual_modes = re.findall(r'data-concierge-mode="([^"]+)"', lobby)
        self.assertEqual(actual_modes, ["agent", "livedesk"])
        self.assertNotIn("APP Push", lobby)
        self.assertNotIn("WebPush", lobby)
        self.assertNotIn("MA Journey", lobby)

    def test_scene_assets_exist_in_source_and_docs(self):
        expected_assets = [
            "resort-hero-family-v2.png",
            "resort-engagement-family-v2.png",
            "resort-concierge-lobby-v2.png",
            "journey-prestay-family-v2.png",
            "journey-instay-family-v2.png",
            "journey-poststay-family-v2.png",
        ]

        for image_name in expected_assets:
            with self.subTest(image_name=image_name):
                self.assertTrue((ROOT / "static/imgs" / image_name).exists())
                self.assertTrue((ROOT / "docs/static/imgs" / image_name).exists())
```

- [ ] **Step 2: Replace legacy keyboard/data assertions with the new module contract**

Replace `test_channel_background_mapping_and_exports_are_exact`, `test_channel_tabs_have_complete_keyboard_semantics`, `test_channel_state_machine_handles_rapid_clicks_and_reduced_motion`, and `test_js_uses_aurora_hotel_scenarios_and_product_roles` with:

```python
    def test_interaction_modules_and_accessibility_hooks_are_present(self):
        template = self.read("templates/solutions/travel-hotel.html")
        js = self.read("static/js/solution-travel-hotel.js")

        required_template_hooks = [
            'role="tablist"',
            'role="tab"',
            'role="tabpanel"',
            'aria-selected="true"',
            'aria-controls="engagement-panel"',
            'aria-controls="concierge-panel"',
            'aria-controls="journey-panel"',
            'tabindex="-1"',
            'aria-live="polite"',
        ]
        for hook in required_template_hooks:
            with self.subTest(hook=hook):
                self.assertIn(hook, template)

        required_js_terms = [
            "TOUCHPOINT_CHANNELS",
            "CONCIERGE_MODES",
            "GUEST_JOURNEY",
            "setupTabs",
            "renderTouchpoint",
            "renderConcierge",
            "renderJourney",
            "ArrowRight",
            "ArrowLeft",
            "ArrowDown",
            "ArrowUp",
            "Home",
            "End",
            "prefers-reduced-motion: reduce",
        ]
        for term in required_js_terms:
            with self.subTest(term=term):
                self.assertIn(term, js)

    def test_javascript_exports_exact_data_keys(self):
        js_path = ROOT / "static/js/solution-travel-hotel.js"
        harness = r"""
const fs = require("node:fs");
let readyCallback = null;
global.document = {
  currentScript: { src: "http://example.test/static/js/solution-travel-hotel.js" },
  baseURI: "http://example.test/solutions/travel-hotel",
  addEventListener(name, callback) {
    if (name === "DOMContentLoaded") readyCallback = callback;
  },
};
global.window = {
  matchMedia() { return { matches: false }; },
  setTimeout,
  clearTimeout,
  requestAnimationFrame(callback) { callback(); },
};

eval(fs.readFileSync(process.argv[1], "utf8"));
const demo = window.AuroraResortDemo;
console.log(JSON.stringify({
  touchpoints: Object.keys(demo.TOUCHPOINT_CHANNELS),
  concierge: Object.keys(demo.CONCIERGE_MODES),
  journey: Object.keys(demo.GUEST_JOURNEY),
  hasReadyCallback: typeof readyCallback === "function",
}));
"""
        completed = subprocess.run(
            ["node", "-e", harness, str(js_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        result = json.loads(completed.stdout)

        self.assertEqual(
            result["touchpoints"],
            ["app", "webpush", "sms", "whatsapp", "email", "ma"],
        )
        self.assertEqual(result["concierge"], ["agent", "livedesk"])
        self.assertEqual(result["journey"], ["prestay", "instay", "poststay"])
        self.assertTrue(result["hasReadyCallback"])
```

- [ ] **Step 3: Add CSS, export, and visible-brand safety assertions**

Replace `test_docs_export_is_synced` and `test_old_hotel_brand_is_removed_from_web_artifacts` with:

```python
    def test_scene_css_contract_and_exports_are_synced(self):
        css = self.read("static/css/solution-travel-hotel.css")
        docs_css = self.read("docs/static/css/solution-travel-hotel.css")
        js = self.read("static/js/solution-travel-hotel.js")
        docs_js = self.read("docs/static/js/solution-travel-hotel.js")
        docs_html = self.read("docs/solutions/travel-hotel/index.html")

        required_selectors = [
            ".sol-scene",
            ".sol-hero-scene",
            ".sol-engagement",
            ".sol-concierge",
            ".sol-journey-stage",
            ".sol-value-band",
            ".sol-tab",
            ".sol-tab:focus-visible",
            ".is-transitioning",
        ]
        for selector in required_selectors:
            with self.subTest(selector=selector):
                self.assertIn(selector, css)

        self.assertIn("@media (prefers-reduced-motion: reduce)", css)
        self.assertIn("@media (max-width: 900px)", css)
        self.assertIn("@media (max-width: 640px)", css)
        self.assertEqual(css, docs_css)
        self.assertEqual(js, docs_js)

        for section_id in [
            'id="resort-hero"',
            'id="engagement-hub"',
            'id="concierge-lobby"',
            'id="guest-journey"',
            'id="group-value"',
        ]:
            with self.subTest(section_id=section_id):
                self.assertIn(section_id, docs_html)

    def test_visible_web_artifacts_use_only_the_fictional_brand(self):
        web_artifacts = [
            "templates/solutions/travel-hotel.html",
            "static/js/solution-travel-hotel.js",
            "docs/solutions/travel-hotel/index.html",
            "docs/static/js/solution-travel-hotel.js",
        ]
        forbidden_terms = [
            "FOLIDAY",
            "复星旅游文化",
            "Club Med",
            "地中海俱乐部",
            "Holiday Inn",
            "假日酒店",
            "IHG",
        ]

        for artifact in web_artifacts:
            content = self.read(artifact)
            self.assertIn("Aurora Hotel", content)
            for term in forbidden_terms:
                with self.subTest(artifact=artifact, term=term):
                    self.assertNotIn(term, content)
```

- [ ] **Step 4: Run the new tests and verify RED**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
```

Expected: FAIL because the five new section IDs, six new images, three JavaScript modules, and scene CSS selectors do not exist yet.

- [ ] **Step 5: Commit the failing contract**

```bash
git add tests/test_travel_hotel_demo.py
git commit -m "test: define family resort solution page contract"
```

---

### Task 2: Generate And Install Six Clean Scene Images

**Files:**
- Create: `static/imgs/resort-hero-family-v2.png`
- Create: `static/imgs/resort-engagement-family-v2.png`
- Create: `static/imgs/resort-concierge-lobby-v2.png`
- Create: `static/imgs/journey-prestay-family-v2.png`
- Create: `static/imgs/journey-instay-family-v2.png`
- Create: `static/imgs/journey-poststay-family-v2.png`
- Create: matching files under `docs/static/imgs/`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Generate the hero image with the built-in image generation tool**

Use the `imagegen` skill and built-in `image_gen` tool with this prompt:

```text
Use case: photorealistic-natural
Asset type: full-bleed website hero for a premium global family resort solution demo
Primary request: create a cinematic premium family resort destination at golden morning light, with a multigenerational family arriving happily near a contemporary oceanfront resort, lush botanical landscaping, visible resort architecture, and an international vacation atmosphere
Composition/framing: ultra-wide 16:9 landscape; family and architecture are clearly inspectable; keep calm negative space across the left-center for Chinese headline copy; preserve a visible lower edge that can lead into the next page section
Lighting/mood: warm natural sunlight, optimistic, refined, high-end hospitality editorial photography
Color palette: ocean blue-green, botanical green, sunlight gold, clean white, restrained coral details
Constraints: realistic proportions and expressions; premium but welcoming; no dark moody grade
Avoid: any text, logos, signage, UI, watermark, blur, bokeh blobs, gradient graphics, branded uniforms, identifiable real-world resort brands
```

Inspect the result for realistic faces, usable text space, and a clean 16:9 composition. Copy the selected output to:

```text
static/imgs/resort-hero-family-v2.png
```

- [ ] **Step 2: Generate the EngageLab engagement scene**

Use:

```text
Use case: photorealistic-natural
Asset type: wide website scene background behind an interactive guest-engagement console
Primary request: a premium family preparing for an international resort holiday in a bright contemporary home, parents and children reviewing travel plans and luggage together, with a subtle view of a tropical destination outside
Composition/framing: ultra-wide 16:9 landscape; people grouped on the right half; generous uncluttered negative space on the left and lower-left for translucent HTML controls; complete bodies and meaningful travel details remain visible
Lighting/mood: bright natural daylight, anticipation, organized and joyful
Color palette: clean white, botanical green, ocean teal, sunlight gold, very small coral accents
Constraints: editorial hospitality photography; scene must work beneath readable overlays
Avoid: phones with readable screens, generated notifications, UI, text, logos, watermark, excessive luggage clutter, stock-photo posing, dark shadows
```

Copy the selected output to:

```text
static/imgs/resort-engagement-family-v2.png
```

- [ ] **Step 3: Generate the full-width intelligent concierge lobby**

Use:

```text
Use case: photorealistic-natural
Asset type: full-bleed website background for an AI concierge and human service console
Primary request: an expansive premium resort lobby with tall windows, botanical interior landscaping, warm stone and wood details, a visible concierge desk, international family guests, and attentive hospitality staff
Composition/framing: ultra-wide 16:9 landscape; architectural depth spans edge to edge; keep the central-left foreground visually calm for a large HTML service console; place guests and staff toward the right third without cropping them
Lighting/mood: luminous late-afternoon natural light, calm, assured, globally premium
Color palette: botanical green, clear white stone, warm sunlight gold, restrained ocean accents
Constraints: realistic contemporary resort; lobby must feel substantially larger than a dashboard background
Avoid: readable signage, text, logos, real hotel branding, UI, watermark, dark nightclub lighting, empty sterile lobby, fisheye distortion
```

Copy the selected output to:

```text
static/imgs/resort-concierge-lobby-v2.png
```

- [ ] **Step 4: Generate the three journey images**

Use one built-in generation call per prompt.

Pre-stay:

```text
Use case: photorealistic-natural
Asset type: website journey scene for pre-stay planning
Primary request: a family at home planning a premium resort trip together, reviewing destination options, children's activities, dining, and transport, with passports and tasteful travel materials
Composition/framing: wide 16:9 landscape; family on the right; clean left area for HTML copy; show planning behavior without readable screen text
Lighting/mood: optimistic morning daylight, anticipation and confidence
Color palette: ocean teal, botanical green, warm gold, clean neutrals
Constraints: realistic family interaction; polished hospitality campaign photography
Avoid: readable text, logos, phone UI, watermark, staged pointing, excessive props
```

In-stay:

```text
Use case: photorealistic-natural
Asset type: website journey scene for in-stay resort service
Primary request: a family enjoying a premium resort pool and activity area while a hospitality team member provides warm assistance, showing active vacation service rather than posing
Composition/framing: wide 16:9 landscape; family activity on the right and middle; calm left side for HTML copy; resort facilities visibly inspectable
Lighting/mood: bright afternoon, energetic but refined, safe family atmosphere
Color palette: ocean blue-green, botanical green, sunlight gold, small coral accents
Constraints: realistic water, people, and architecture; high-quality travel editorial photography
Avoid: logos, text, UI, watermark, unsafe pool behavior, blur, overly saturated colors
```

Post-stay:

```text
Use case: photorealistic-natural
Asset type: website journey scene for post-stay loyalty and memory
Primary request: a relaxed family at home revisiting beautiful resort memories together and considering a future trip, with subtle travel photographs and a warm connected mood
Composition/framing: wide 16:9 landscape; family on the right; uncluttered left side for HTML outcome copy; no readable screens or printed words
Lighting/mood: warm early evening window light, nostalgic, loyal, future-looking
Color palette: botanical green, warm gold, clear white, restrained ocean accents
Constraints: natural candid expressions; premium but believable family lifestyle photography
Avoid: readable text, logos, UI, watermark, sadness, excessive sepia, dark shadows
```

Save the selected outputs as:

```text
static/imgs/journey-prestay-family-v2.png
static/imgs/journey-instay-family-v2.png
static/imgs/journey-poststay-family-v2.png
```

- [ ] **Step 5: Verify dimensions and visual suitability**

Run:

```bash
file static/imgs/resort-hero-family-v2.png \
  static/imgs/resort-engagement-family-v2.png \
  static/imgs/resort-concierge-lobby-v2.png \
  static/imgs/journey-prestay-family-v2.png \
  static/imgs/journey-instay-family-v2.png \
  static/imgs/journey-poststay-family-v2.png
```

Expected: all six files are valid PNG images. Inspect each image with `view_image`; reject and regenerate any image containing visible text, brand marks, broken anatomy, unusable overlay space, or a composition that hides the actual resort/family context.

- [ ] **Step 6: Copy approved assets into the docs tree**

Run:

```bash
cp static/imgs/resort-hero-family-v2.png docs/static/imgs/resort-hero-family-v2.png
cp static/imgs/resort-engagement-family-v2.png docs/static/imgs/resort-engagement-family-v2.png
cp static/imgs/resort-concierge-lobby-v2.png docs/static/imgs/resort-concierge-lobby-v2.png
cp static/imgs/journey-prestay-family-v2.png docs/static/imgs/journey-prestay-family-v2.png
cp static/imgs/journey-instay-family-v2.png docs/static/imgs/journey-instay-family-v2.png
cp static/imgs/journey-poststay-family-v2.png docs/static/imgs/journey-poststay-family-v2.png
```

- [ ] **Step 7: Run the asset test**

Run:

```bash
python3 -m unittest \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_scene_assets_exist_in_source_and_docs
```

Expected: PASS.

- [ ] **Step 8: Commit generated assets**

```bash
git add \
  static/imgs/resort-hero-family-v2.png \
  static/imgs/resort-engagement-family-v2.png \
  static/imgs/resort-concierge-lobby-v2.png \
  static/imgs/journey-prestay-family-v2.png \
  static/imgs/journey-instay-family-v2.png \
  static/imgs/journey-poststay-family-v2.png \
  docs/static/imgs/resort-hero-family-v2.png \
  docs/static/imgs/resort-engagement-family-v2.png \
  docs/static/imgs/resort-concierge-lobby-v2.png \
  docs/static/imgs/journey-prestay-family-v2.png \
  docs/static/imgs/journey-instay-family-v2.png \
  docs/static/imgs/journey-poststay-family-v2.png
git commit -m "assets: add family resort solution scenes"
```

---

### Task 3: Rebuild The Template As Five Cinematic Scenes

**Files:**
- Modify: `templates/solutions/travel-hotel.html`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Update the hero image declaration and remove decorative background orbs**

Replace the page-specific inline style with:

```html
<style>
  .sol-hero-scene .sol-scene__image {
    object-position: center 48%;
  }
</style>
```

Delete the complete `.sol-bg` element containing `.sol-bg__orb` children. Keep the skip link, header logo, Livedesk SDK, and page JavaScript include.

- [ ] **Step 2: Replace the progress navigation**

Use:

```html
<nav class="sol-progress" aria-label="页面进度导航">
  <a class="sol-progress__dot is-active" href="#resort-hero" data-target="resort-hero" aria-label="全球家庭度假方案"></a>
  <a class="sol-progress__dot" href="#engagement-hub" data-target="engagement-hub" aria-label="全旅程主动触达"></a>
  <a class="sol-progress__dot" href="#concierge-lobby" data-target="concierge-lobby" aria-label="智能管家与人工护航"></a>
  <a class="sol-progress__dot" href="#guest-journey" data-target="guest-journey" aria-label="住前住中住后旅程"></a>
  <a class="sol-progress__dot" href="#group-value" data-target="group-value" aria-label="集团级价值"></a>
</nav>
```

- [ ] **Step 3: Replace the existing hero with the new opening scene**

Use:

```html
<section id="resort-hero" class="sol-scene sol-hero-scene sol-bleed" aria-labelledby="hero-heading">
  <img
    class="sol-scene__image"
    src="{{ url_for('static', filename='imgs/resort-hero-family-v2.png') }}"
    alt=""
    width="1920"
    height="1080"
    loading="eager"
    decoding="async"
  />
  <div class="sol-scene__scrim sol-scene__scrim--hero" aria-hidden="true"></div>
  <div class="sol-scene__content sol-hero-scene__content">
    <p class="sol-eyebrow">Aurora Hotel · Global Family Resort Experience</p>
    <h1 id="hero-heading">全球化家庭度假集团全旅程智能服务解决方案</h1>
    <p class="sol-hero-scene__lead">
      从宾客产生度假灵感开始，到预订、抵达、住中服务与再次出发：
      EngageLab 主动触达，GPTBots 提供 24 小时智能管家，Livedesk 以人工服务完成复杂场景护航。
    </p>
    <div class="sol-hero-scene__promise" aria-label="解决方案三大角色">
      <span><strong>EngageLab</strong> 主动经营旅程</span>
      <span><strong>GPTBots</strong> 连续理解与服务</span>
      <span><strong>Livedesk</strong> 人工判断与闭环</span>
    </div>
  </div>
  <a class="sol-scene__next" href="#engagement-hub" aria-label="查看全旅程主动触达">
    <span aria-hidden="true">↓</span>
  </a>
</section>
```

- [ ] **Step 4: Replace the mixed capability console with the EngageLab scene**

Insert this as the first section inside `<main id="main" class="sol-main">`:

```html
<section id="engagement-hub" class="sol-scene sol-engagement sol-bleed" aria-labelledby="engagement-heading">
  <img
    class="sol-scene__image"
    src="{{ url_for('static', filename='imgs/resort-engagement-family-v2.png') }}"
    alt=""
    width="1920"
    height="1080"
    loading="lazy"
    decoding="async"
  />
  <div class="sol-scene__scrim sol-scene__scrim--engagement" aria-hidden="true"></div>
  <div class="sol-scene__content sol-engagement__content">
    <header class="sol-scene-head">
      <p class="sol-eyebrow">Scene 01 · EngageLab</p>
      <h2 id="engagement-heading">在宾客开口前，主动经营每一次度假期待</h2>
      <p>把预订提醒、交通指引、会员权益、亲子活动和目的地灵感送到正确客群的正确时刻。</p>
    </header>

    <div class="sol-engagement__console">
      <div class="sol-tablist sol-tablist--channels" role="tablist" aria-label="EngageLab 触达渠道">
        <button class="sol-tab is-active" id="touchpoint-tab-app" type="button" role="tab" aria-selected="true" aria-controls="engagement-panel" tabindex="0" data-touchpoint="app">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M10 18h4"></path></svg>
          <span>APP Push</span>
        </button>
        <button class="sol-tab" id="touchpoint-tab-webpush" type="button" role="tab" aria-selected="false" aria-controls="engagement-panel" tabindex="-1" data-touchpoint="webpush">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M8 22h8M12 18v4"></path></svg>
          <span>WebPush</span>
        </button>
        <button class="sol-tab" id="touchpoint-tab-sms" type="button" role="tab" aria-selected="false" aria-controls="engagement-panel" tabindex="-1" data-touchpoint="sms">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path></svg>
          <span>SMS</span>
        </button>
        <button class="sol-tab" id="touchpoint-tab-whatsapp" type="button" role="tab" aria-selected="false" aria-controls="engagement-panel" tabindex="-1" data-touchpoint="whatsapp">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-4A8 8 0 1 1 20 11.5z"></path><path d="M9 8c1 3 2 4 5 5"></path></svg>
          <span>WhatsApp</span>
        </button>
        <button class="sol-tab" id="touchpoint-tab-email" type="button" role="tab" aria-selected="false" aria-controls="engagement-panel" tabindex="-1" data-touchpoint="email">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>
          <span>Email</span>
        </button>
        <button class="sol-tab" id="touchpoint-tab-ma" type="button" role="tab" aria-selected="false" aria-controls="engagement-panel" tabindex="-1" data-touchpoint="ma">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="6" r="2"></circle><circle cx="12" cy="18" r="2"></circle><path d="M8 6h8M7 8l4 8M17 8l-4 8"></path></svg>
          <span>MA Journey</span>
        </button>
      </div>

      <div class="sol-engagement__panel" id="engagement-panel" role="tabpanel" aria-labelledby="touchpoint-tab-app" aria-live="polite" tabindex="0">
        <div class="sol-engagement__message">
          <p class="sol-kicker" id="touchpoint-moment">抵达前 72 小时</p>
          <h3 id="touchpoint-title">一家人的假期，从从容出发开始</h3>
          <p id="touchpoint-message">入住提醒、机场接送、儿童俱乐部开放时间与早餐偏好已经为您整理好。</p>
          <button type="button" class="sol-message-action" aria-label="打开 Aurora Hotel 智能管家">
            打开智能管家
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <dl class="sol-engagement__facts">
          <div><dt>目标客群</dt><dd id="touchpoint-segment">已预订的亲子家庭</dd></div>
          <div><dt>旅程触发</dt><dd id="touchpoint-trigger">入住前 72 小时自动触发</dd></div>
          <div><dt>经营目标</dt><dd id="touchpoint-objective">降低行前不确定性并采集服务偏好</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Add the full-width lobby with only GPTBots and Livedesk**

Insert immediately after `#engagement-hub`:

```html
<section id="concierge-lobby" class="sol-scene sol-concierge sol-bleed" aria-labelledby="concierge-heading">
  <img
    class="sol-scene__image"
    src="{{ url_for('static', filename='imgs/resort-concierge-lobby-v2.png') }}"
    alt=""
    width="1920"
    height="1080"
    loading="lazy"
    decoding="async"
  />
  <div class="sol-scene__scrim sol-scene__scrim--concierge" aria-hidden="true"></div>
  <div class="sol-scene__content sol-concierge__content">
    <header class="sol-scene-head sol-scene-head--light">
      <p class="sol-eyebrow">Scene 02 · Intelligent Concierge Lobby</p>
      <h2 id="concierge-heading">AI 承接规模与连续性，人工提供判断与温度</h2>
      <p>宾客无需理解后台系统，只会感受到一位始终在线、必要时有人接手的度假管家。</p>
    </header>

    <div class="sol-concierge__console">
      <div class="sol-tablist sol-tablist--modes" role="tablist" aria-label="智能管家服务模式">
        <button class="sol-tab is-active" id="concierge-tab-agent" type="button" role="tab" aria-selected="true" aria-controls="concierge-panel" tabindex="0" data-concierge-mode="agent">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="3"></rect><path d="M9 10h.01M15 10h.01M8 15h8M12 2v3"></path></svg>
          <span>GPTBots AI Agent</span>
        </button>
        <button class="sol-tab" id="concierge-tab-livedesk" type="button" role="tab" aria-selected="false" aria-controls="concierge-panel" tabindex="-1" data-concierge-mode="livedesk">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13v-2a8 8 0 0 1 16 0v2"></path><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2zM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2zM17 19c0 2-2 3-5 3"></path></svg>
          <span>Livedesk 人工护航</span>
        </button>
      </div>

      <div class="sol-concierge__panel" id="concierge-panel" role="tabpanel" aria-labelledby="concierge-tab-agent" aria-live="polite" tabindex="0">
        <aside class="sol-concierge__identity">
          <span class="sol-concierge__mark" aria-hidden="true">A</span>
          <p class="sol-kicker" id="concierge-status">GPTBots · 24/7 Online</p>
          <h3 id="concierge-title">懂目的地，也记得每个家庭的偏好</h3>
          <p id="concierge-role">多语言问答、知识检索、个性化推荐、需求采集与服务流程引导。</p>
        </aside>
        <div class="sol-concierge__conversation">
          <p class="sol-chat-line sol-chat-line--guest" id="concierge-guest">两个孩子分别 5 岁和 9 岁，明天上午有什么适合全家的活动？</p>
          <p class="sol-chat-line sol-chat-line--service" id="concierge-reply">结合天气、年龄和您上次偏好的户外项目，我建议 09:30 的家庭帆船体验；我也可以一起确认早餐时段和接驳。</p>
          <div class="sol-concierge__action">
            <div>
              <span>Next Best Action</span>
              <strong id="concierge-action">采集参加人数并发起活动预约</strong>
            </div>
            <span class="sol-status" id="concierge-action-status">AI Handling</span>
          </div>
        </div>
        <aside class="sol-concierge__handoff">
          <p class="sol-kicker">协同状态</p>
          <ol id="concierge-steps">
            <li class="is-complete">理解意图与家庭信息</li>
            <li class="is-active">调用度假村知识与偏好</li>
            <li>复杂场景转人工并保留上下文</li>
          </ol>
          <p id="concierge-assurance">标准需求由 AI 即时闭环，敏感、紧急或高价值场景由人工无缝接手。</p>
        </aside>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Replace the six-step timeline with a three-stage interactive journey**

Insert immediately after `#concierge-lobby`:

```html
<section id="guest-journey" class="sol-journey-stage" aria-labelledby="journey-heading">
  <div class="sol-journey-stage__inner">
    <header class="sol-scene-head sol-scene-head--dark">
      <p class="sol-eyebrow">Scene 03 · Guest Journey</p>
      <h2 id="journey-heading">从第一次心动，到下一次出发</h2>
      <p>触达、智能接待与人工服务围绕同一份宾客上下文持续协作。</p>
    </header>

    <div class="sol-tablist sol-tablist--journey" role="tablist" aria-label="宾客旅程阶段">
      <button class="sol-tab is-active" id="journey-tab-prestay" type="button" role="tab" aria-selected="true" aria-controls="journey-panel" tabindex="0" data-journey-stage="prestay">
        <span>01</span><strong>住前</strong><small>灵感 · 预订 · 行前</small>
      </button>
      <button class="sol-tab" id="journey-tab-instay" type="button" role="tab" aria-selected="false" aria-controls="journey-panel" tabindex="-1" data-journey-stage="instay">
        <span>02</span><strong>住中</strong><small>问答 · 服务 · 升级</small>
      </button>
      <button class="sol-tab" id="journey-tab-poststay" type="button" role="tab" aria-selected="false" aria-controls="journey-panel" tabindex="-1" data-journey-stage="poststay">
        <span>03</span><strong>住后</strong><small>回访 · 权益 · 复购</small>
      </button>
    </div>

    <div class="sol-journey-stage__panel" id="journey-panel" role="tabpanel" aria-labelledby="journey-tab-prestay" aria-live="polite" tabindex="0">
      <div class="sol-journey-stage__media">
        <img
          id="journey-image"
          src="{{ url_for('static', filename='imgs/journey-prestay-family-v2.png') }}"
          alt="一家人共同规划度假行程"
          width="1200"
          height="675"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="sol-journey-stage__story">
        <p class="sol-kicker" id="journey-moment">Pre-stay · 住前</p>
        <h3 id="journey-title">把行前不确定，变成值得期待的准备</h3>
        <p id="journey-scenario">从目的地与套餐咨询，到未完成预订召回、交通指引、儿童活动和餐饮偏好采集。</p>
        <div class="sol-journey-stage__flow" aria-label="产品协同">
          <span id="journey-engagelab"><strong>EngageLab</strong> 识别旅程节点并主动触达</span>
          <span id="journey-gptbots"><strong>GPTBots</strong> 承接问答、推荐与信息采集</span>
          <span id="journey-livedesk"><strong>Livedesk</strong> 处理复杂政策与高价值机会</span>
        </div>
        <div class="sol-journey-stage__outcome">
          <span>Journey Outcome</span>
          <strong id="journey-outcome">提高响应与预订信心，让服务准备发生在到店之前</strong>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Replace generic architecture/build catalog/footer with the group value close**

Insert after `#guest-journey`, before the existing modal markup:

```html
<section id="group-value" class="sol-value-band sol-bleed" aria-labelledby="value-heading">
  <div class="sol-value-band__inner">
    <div class="sol-value-band__statement">
      <p class="sol-eyebrow">Group-Level Value</p>
      <h2 id="value-heading">一套宾客上下文，连接全球触点、智能服务与人工团队</h2>
      <p>不是简单增加一个 AI 客服，而是把获客、预订、入住、服务与复购组织成可持续运营的宾客体验闭环。</p>
    </div>
    <dl class="sol-value-band__proofs">
      <div><dt>24/7</dt><dd>智能管家持续在线</dd></div>
      <div><dt>3 stages</dt><dd>住前、住中、住后连续服务</dd></div>
      <div><dt>1 context</dt><dd>跨渠道与团队共享宾客上下文</dd></div>
      <div><dt>Human ready</dt><dd>复杂场景随时人工接力</dd></div>
    </dl>
    <ul class="sol-value-band__capabilities">
      <li>全球多语言服务一致性</li>
      <li>家庭偏好持续沉淀与复用</li>
      <li>主动触达与个性化推荐</li>
      <li>工单优先级、SLA 与闭环</li>
    </ul>
    <button class="sol-primary-action" id="sol-cap-open-booking" type="button">
      预约方案演示
      <span aria-hidden="true">→</span>
    </button>
    <div class="sol-value-band__brands" aria-label="解决方案产品">
      <img src="{{ url_for('static', filename='imgs/Engagelablogo.svg') }}" alt="EngageLab" width="132" height="36" loading="lazy" decoding="async" />
      <img src="{{ url_for('static', filename='imgs/GPTBotsLogo.png') }}" alt="GPTBots" width="120" height="36" loading="lazy" decoding="async" />
      <span>Livedesk</span>
    </div>
  </div>
</section>
```

Keep the existing `#sol-calendly-modal`, `#sol-lightbox`, `.sol-widget-hint`, and Livedesk SDK integration. Remove the old `.sol-cta` footer because its placeholder contact copy weakens the presentation.

- [ ] **Step 8: Run template-focused tests**

Run:

```bash
python3 -m unittest \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_template_has_approved_five_scene_architecture_in_order \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_engagement_and_lobby_controls_have_strict_product_boundaries \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_visible_web_artifacts_use_only_the_fictional_brand
```

Expected: the first two tests PASS. The visible-artifact test can still fail on the old docs export until Task 6.

- [ ] **Step 9: Commit the five-scene template**

```bash
git add templates/solutions/travel-hotel.html
git commit -m "feat: rebuild resort solution as five scenes"
```

---

### Task 4: Replace The Legacy Styles With A Scene-Led Visual System

**Files:**
- Modify: `static/css/solution-travel-hotel.css`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Replace the travel-hotel stylesheet with the new foundation**

Start the file with:

```css
:root {
  --sol-ink: #15312d;
  --sol-ink-strong: #0b201d;
  --sol-ocean: #087f83;
  --sol-botanical: #2f6f54;
  --sol-gold: #d6a64f;
  --sol-coral: #d95f4f;
  --sol-white: #ffffff;
  --sol-cloud: #f4f7f4;
  --sol-line: rgba(255, 255, 255, 0.24);
  --sol-shadow: 0 24px 70px rgba(8, 31, 28, 0.22);
  --sol-content: min(1180px, calc(100% - 48px));
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body.page-solution-travel-hotel {
  margin: 0;
  overflow-x: clip;
  color: var(--sol-ink);
  background: var(--sol-cloud);
}

.page-solution-travel-hotel button,
.page-solution-travel-hotel a {
  -webkit-tap-highlight-color: transparent;
}

.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
  transform: translateY(-160%);
  padding: 10px 14px;
  color: var(--sol-white);
  background: var(--sol-ink-strong);
  border-radius: 4px;
}

.skip-link:focus {
  transform: translateY(0);
}

.sol-bleed {
  width: 100%;
}

.sol-page-head {
  position: absolute;
  inset: 0 0 auto;
  z-index: 20;
  pointer-events: none;
}

.sol-page-head__bar {
  width: var(--sol-content);
  margin: 0 auto;
  padding-top: 24px;
}

.sol-page-head__brand {
  display: inline-flex;
  pointer-events: auto;
  filter: brightness(0) invert(1);
}

.sol-page-head__brand-img {
  width: 116px;
  height: auto;
}

.sol-main {
  display: block;
}

.sol-scene {
  position: relative;
  isolation: isolate;
  min-height: 760px;
  overflow: hidden;
  background: var(--sol-ink-strong);
}

.sol-scene__image,
.sol-journey-stage__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sol-scene__image {
  position: absolute;
  inset: 0;
  z-index: -3;
}

.sol-scene__scrim {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.sol-scene__content {
  position: relative;
  width: var(--sol-content);
  min-height: inherit;
  margin: 0 auto;
  padding: 112px 0 88px;
}

.sol-scene__scrim--hero {
  background:
    linear-gradient(90deg, rgba(5, 24, 22, 0.82) 0%, rgba(5, 24, 22, 0.55) 40%, rgba(5, 24, 22, 0.08) 72%),
    linear-gradient(0deg, rgba(5, 24, 22, 0.45), transparent 45%);
}

.sol-scene__scrim--engagement {
  background: linear-gradient(90deg, rgba(7, 34, 31, 0.82) 0%, rgba(7, 34, 31, 0.5) 52%, rgba(7, 34, 31, 0.08) 82%);
}

.sol-scene__scrim--concierge {
  background:
    linear-gradient(90deg, rgba(5, 24, 22, 0.76) 0%, rgba(5, 24, 22, 0.28) 62%, rgba(5, 24, 22, 0.12) 100%),
    linear-gradient(0deg, rgba(5, 24, 22, 0.45), transparent 52%);
}

.sol-eyebrow,
.sol-kicker {
  margin: 0 0 12px;
  letter-spacing: 0;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}

.sol-eyebrow {
  color: #f3ca79;
}

.sol-kicker {
  color: var(--sol-ocean);
}

.sol-scene-head {
  max-width: 720px;
  margin-bottom: 32px;
  color: var(--sol-white);
}

.sol-scene-head h2,
.sol-value-band h2 {
  margin: 0;
  letter-spacing: 0;
  line-height: 1.16;
}

.sol-scene-head h2 {
  font-size: 52px;
}

.sol-scene-head p:last-child {
  max-width: 680px;
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.82);
}

.sol-scene-head--dark {
  color: var(--sol-ink-strong);
}

.sol-scene-head--dark p:last-child {
  color: #51635f;
}
```

- [ ] **Step 2: Add hero, progress, and shared control styles**

Append:

```css
.sol-hero-scene {
  min-height: min(900px, 94vh);
}

.sol-hero-scene__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-top: 156px;
  color: var(--sol-white);
}

.sol-hero-scene h1 {
  max-width: 850px;
  margin: 0;
  font-size: 78px;
  line-height: 1.05;
  letter-spacing: 0;
}

.sol-hero-scene__lead {
  max-width: 720px;
  margin: 24px 0 0;
  font-size: 20px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.86);
}

.sol-hero-scene__promise {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.28);
}

.sol-hero-scene__promise span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
}

.sol-hero-scene__promise strong {
  color: var(--sol-white);
}

.sol-scene__next {
  position: absolute;
  left: 50%;
  bottom: 24px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  transform: translateX(-50%);
  color: var(--sol-white);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  text-decoration: none;
}

.sol-progress {
  position: fixed;
  top: 50%;
  right: 20px;
  z-index: 30;
  display: grid;
  gap: 10px;
  transform: translateY(-50%);
}

.sol-progress__dot {
  width: 9px;
  height: 9px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: rgba(10, 36, 32, 0.38);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
}

.sol-progress__dot.is-active,
.sol-progress__dot.is-passed {
  background: var(--sol-gold);
  border-color: var(--sol-gold);
}

.sol-tablist {
  display: flex;
  gap: 8px;
}

.sol-tab {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 13px;
  color: inherit;
  font: inherit;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.sol-tab svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex: 0 0 auto;
}

.sol-tab:hover {
  transform: translateY(-1px);
}

.sol-tab:focus-visible,
.sol-message-action:focus-visible,
.sol-primary-action:focus-visible,
.sol-scene__next:focus-visible,
.sol-progress__dot:focus-visible {
  outline: 3px solid #ffe0a1;
  outline-offset: 3px;
}

.sol-tab.is-active {
  color: var(--sol-ink-strong);
  border-color: var(--sol-gold);
  background: var(--sol-gold);
}

.sol-engagement__panel,
.sol-concierge__panel,
.sol-journey-stage__panel {
  transition: opacity 160ms ease, transform 160ms ease;
}

.is-transitioning {
  opacity: 0.25;
  transform: translateY(6px);
}
```

- [ ] **Step 3: Add the EngageLab and concierge scene styles**

Append:

```css
.sol-engagement {
  min-height: 820px;
}

.sol-engagement__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sol-engagement__console {
  width: min(850px, 100%);
  overflow: hidden;
  color: var(--sol-white);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;
  background: rgba(8, 35, 31, 0.76);
  box-shadow: var(--sol-shadow);
  backdrop-filter: blur(16px);
}

.sol-tablist--channels {
  padding: 12px;
  overflow-x: auto;
  border-bottom: 1px solid var(--sol-line);
}

.sol-tablist--channels .sol-tab {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.86);
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
}

.sol-tablist--channels .sol-tab.is-active {
  color: var(--sol-ink-strong);
  border-color: var(--sol-gold);
  background: var(--sol-gold);
}

.sol-engagement__panel {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(250px, 0.7fr);
}

.sol-engagement__message,
.sol-engagement__facts {
  padding: 30px;
}

.sol-engagement__message {
  border-right: 1px solid var(--sol-line);
}

.sol-engagement__message h3 {
  margin: 0;
  font-size: 30px;
  letter-spacing: 0;
}

.sol-engagement__message > p:not(.sol-kicker) {
  margin: 16px 0 24px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

.sol-message-action,
.sol-primary-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  color: var(--sol-white);
  font: inherit;
  font-weight: 700;
  border: 0;
  border-radius: 6px;
  background: var(--sol-coral);
  cursor: pointer;
}

.sol-engagement__facts {
  display: grid;
  align-content: center;
  gap: 20px;
  margin: 0;
}

.sol-engagement__facts div {
  padding-bottom: 18px;
  border-bottom: 1px solid var(--sol-line);
}

.sol-engagement__facts div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.sol-engagement__facts dt {
  margin-bottom: 6px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
}

.sol-engagement__facts dd {
  margin: 0;
  line-height: 1.55;
}

.sol-concierge {
  min-height: 880px;
}

.sol-concierge__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sol-concierge__console {
  overflow: hidden;
  color: var(--sol-ink-strong);
  border: 1px solid rgba(255, 255, 255, 0.44);
  border-radius: 8px;
  background: rgba(250, 253, 250, 0.92);
  box-shadow: var(--sol-shadow);
  backdrop-filter: blur(14px);
}

.sol-tablist--modes {
  padding: 12px;
  border-bottom: 1px solid #d7e1dc;
}

.sol-tablist--modes .sol-tab {
  border-color: #c6d2cd;
  background: #eef3ef;
}

.sol-tablist--modes .sol-tab.is-active {
  color: var(--sol-white);
  border-color: var(--sol-ocean);
  background: var(--sol-ocean);
}

.sol-concierge__panel {
  display: grid;
  grid-template-columns: 0.8fr 1.35fr 0.85fr;
  min-height: 350px;
}

.sol-concierge__identity,
.sol-concierge__conversation,
.sol-concierge__handoff {
  padding: 28px;
}

.sol-concierge__identity,
.sol-concierge__conversation {
  border-right: 1px solid #d7e1dc;
}

.sol-concierge__mark {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
  place-items: center;
  color: var(--sol-white);
  font-size: 22px;
  font-weight: 800;
  border-radius: 50%;
  background: var(--sol-botanical);
}

.sol-concierge__identity h3 {
  margin: 0 0 14px;
  font-size: 27px;
  line-height: 1.22;
  letter-spacing: 0;
}

.sol-concierge__identity > p:last-child,
.sol-concierge__handoff > p:last-child {
  line-height: 1.65;
  color: #53645f;
}

.sol-concierge__conversation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  background: #f6f8f6;
}

.sol-chat-line {
  max-width: 88%;
  margin: 0;
  padding: 13px 15px;
  line-height: 1.58;
  border-radius: 8px;
}

.sol-chat-line--guest {
  align-self: flex-end;
  color: var(--sol-white);
  background: var(--sol-ocean);
  border-bottom-right-radius: 2px;
}

.sol-chat-line--service {
  align-self: flex-start;
  background: var(--sol-white);
  border: 1px solid #d9e1dd;
  border-bottom-left-radius: 2px;
}

.sol-concierge__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
  padding-top: 18px;
  border-top: 1px solid #d7e1dc;
}

.sol-concierge__action div {
  display: grid;
  gap: 3px;
}

.sol-concierge__action div span {
  color: #687974;
  font-size: 11px;
  text-transform: uppercase;
}

.sol-status {
  flex: 0 0 auto;
  padding: 6px 9px;
  color: #17563f;
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
  background: #dceee4;
}

.sol-concierge__handoff ol {
  display: grid;
  gap: 18px;
  margin: 24px 0;
  padding-left: 22px;
}

.sol-concierge__handoff li {
  color: #788580;
  line-height: 1.45;
}

.sol-concierge__handoff li.is-complete,
.sol-concierge__handoff li.is-active {
  color: var(--sol-ink-strong);
}

.sol-concierge__handoff li.is-active::marker {
  color: var(--sol-coral);
}
```

- [ ] **Step 4: Add journey and closing value styles**

Append:

```css
.sol-journey-stage {
  padding: 104px 0;
  background: linear-gradient(180deg, #f4f7f4 0%, #ffffff 100%);
}

.sol-journey-stage__inner,
.sol-value-band__inner {
  width: var(--sol-content);
  margin: 0 auto;
}

.sol-tablist--journey {
  margin: 34px 0 20px;
  border-bottom: 1px solid #cfd9d4;
}

.sol-tablist--journey .sol-tab {
  position: relative;
  flex: 1 1 0;
  display: grid;
  grid-template-columns: auto auto 1fr;
  justify-content: start;
  padding: 16px 18px;
  color: #62716d;
  text-align: left;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.sol-tablist--journey .sol-tab::after {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 3px;
  content: "";
  transform: scaleX(0);
  transform-origin: left;
  background: var(--sol-coral);
  transition: transform 160ms ease;
}

.sol-tablist--journey .sol-tab.is-active {
  color: var(--sol-ink-strong);
}

.sol-tablist--journey .sol-tab.is-active::after {
  transform: scaleX(1);
}

.sol-tablist--journey .sol-tab span {
  color: var(--sol-coral);
  font-weight: 800;
}

.sol-tablist--journey .sol-tab small {
  grid-column: 2 / -1;
  color: #71807c;
}

.sol-journey-stage__panel {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  min-height: 540px;
  overflow: hidden;
  border: 1px solid #d6dfda;
  border-radius: 8px;
  background: var(--sol-white);
  box-shadow: 0 24px 60px rgba(24, 62, 54, 0.12);
}

.sol-journey-stage__media {
  min-height: 540px;
  overflow: hidden;
}

.sol-journey-stage__media img {
  transition: opacity 180ms ease, transform 260ms ease;
}

.sol-journey-stage__media img.is-transitioning {
  transform: scale(1.015);
}

.sol-journey-stage__story {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 42px;
}

.sol-journey-stage__story h3 {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
  letter-spacing: 0;
}

.sol-journey-stage__story > p:not(.sol-kicker) {
  margin: 16px 0 24px;
  line-height: 1.7;
  color: #53645f;
}

.sol-journey-stage__flow {
  display: grid;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #d7e1dc;
  border-bottom: 1px solid #d7e1dc;
}

.sol-journey-stage__flow span {
  line-height: 1.5;
}

.sol-journey-stage__outcome {
  display: grid;
  gap: 5px;
  margin-top: 24px;
}

.sol-journey-stage__outcome span {
  color: var(--sol-coral);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.sol-value-band {
  color: var(--sol-white);
  background:
    linear-gradient(115deg, rgba(11, 55, 48, 0.98), rgba(8, 109, 111, 0.94)),
    #0b3730;
}

.sol-value-band__inner {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 44px 70px;
  padding: 96px 0;
}

.sol-value-band__statement h2 {
  max-width: 760px;
  font-size: 58px;
}

.sol-value-band__statement > p:last-child {
  max-width: 680px;
  margin: 20px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 18px;
  line-height: 1.7;
}

.sol-value-band__proofs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  background: rgba(255, 255, 255, 0.22);
}

.sol-value-band__proofs div {
  min-height: 130px;
  padding: 22px;
  background: rgba(8, 48, 43, 0.9);
}

.sol-value-band__proofs dt {
  color: #f4c96f;
  font-size: 28px;
  font-weight: 800;
}

.sol-value-band__proofs dd {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.45;
}

.sol-value-band__capabilities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sol-value-band__capabilities li {
  padding-left: 18px;
  position: relative;
  color: rgba(255, 255, 255, 0.84);
}

.sol-value-band__capabilities li::before {
  position: absolute;
  left: 0;
  color: #f4c96f;
  content: "•";
}

.sol-primary-action {
  justify-self: start;
  align-self: center;
}

.sol-value-band__brands {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}

.sol-value-band__brands img {
  max-height: 30px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.sol-value-band__brands span {
  font-size: 19px;
  font-weight: 800;
}
```

- [ ] **Step 5: Preserve utility modal/widget styles and add responsive behavior**

Retain the existing `.sol-calendly-modal`, `.sol-lightbox`, and `.sol-widget-hint` rules, then append:

```css
@media (max-width: 900px) {
  :root {
    --sol-content: min(100% - 32px, 760px);
  }

  .sol-progress {
    display: none;
  }

  .sol-scene {
    min-height: auto;
  }

  .sol-scene__content {
    padding: 96px 0 72px;
  }

  .sol-hero-scene {
    min-height: 760px;
  }

  .sol-hero-scene h1 {
    font-size: 60px;
  }

  .sol-scene-head h2 {
    font-size: 44px;
  }

  .sol-value-band__statement h2 {
    font-size: 48px;
  }

  .sol-engagement__panel,
  .sol-concierge__panel,
  .sol-journey-stage__panel,
  .sol-value-band__inner {
    grid-template-columns: 1fr;
  }

  .sol-engagement__message {
    border-right: 0;
    border-bottom: 1px solid var(--sol-line);
  }

  .sol-concierge__identity,
  .sol-concierge__conversation {
    border-right: 0;
    border-bottom: 1px solid #d7e1dc;
  }

  .sol-journey-stage__media {
    min-height: 390px;
  }

  .sol-value-band__inner {
    gap: 36px;
  }

  .sol-value-band__brands {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  :root {
    --sol-content: calc(100% - 24px);
  }

  .sol-page-head__bar {
    padding-top: 16px;
  }

  .sol-page-head__brand-img {
    width: 98px;
  }

  .sol-hero-scene {
    min-height: 690px;
  }

  .sol-hero-scene__content {
    justify-content: flex-end;
    padding: 110px 0 80px;
  }

  .sol-hero-scene h1 {
    font-size: 43px;
  }

  .sol-hero-scene__lead,
  .sol-scene-head p:last-child,
  .sol-value-band__statement > p:last-child {
    font-size: 16px;
  }

  .sol-hero-scene__promise {
    display: grid;
  }

  .sol-scene-head h2,
  .sol-value-band__statement h2 {
    font-size: 34px;
  }

  .sol-tablist--channels,
  .sol-tablist--modes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: visible;
  }

  .sol-tablist--channels .sol-tab,
  .sol-tablist--modes .sol-tab {
    min-width: 0;
    padding: 10px 8px;
  }

  .sol-engagement__message,
  .sol-engagement__facts,
  .sol-concierge__identity,
  .sol-concierge__conversation,
  .sol-concierge__handoff,
  .sol-journey-stage__story {
    padding: 22px;
  }

  .sol-engagement__message h3,
  .sol-concierge__identity h3,
  .sol-journey-stage__story h3 {
    font-size: 26px;
  }

  .sol-tablist--journey {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .sol-tablist--journey .sol-tab {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3px;
    padding: 12px 8px;
    text-align: center;
  }

  .sol-tablist--journey .sol-tab small {
    display: none;
  }

  .sol-journey-stage {
    padding: 72px 0;
  }

  .sol-journey-stage__media {
    min-height: 270px;
  }

  .sol-value-band__proofs,
  .sol-value-band__capabilities {
    grid-template-columns: 1fr;
  }

  .sol-value-band__proofs div {
    min-height: 100px;
  }

  .sol-value-band__brands {
    flex-wrap: wrap;
    gap: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .sol-tab,
  .sol-engagement__panel,
  .sol-concierge__panel,
  .sol-journey-stage__panel,
  .sol-journey-stage__media img {
    transition: none;
  }

  .sol-tab:hover {
    transform: none;
  }
}
```

- [ ] **Step 6: Run CSS contract tests**

Run:

```bash
python3 -m unittest \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_scene_css_contract_and_exports_are_synced
```

Expected: FAIL only because the docs CSS has not been synchronized yet.

- [ ] **Step 7: Commit source styles**

```bash
git add static/css/solution-travel-hotel.css
git commit -m "style: add cinematic resort scene system"
```

---

### Task 5: Implement Three Independent Data-Driven Interactions

**Files:**
- Modify: `static/js/solution-travel-hotel.js`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Replace `CAP_CHANNELS` with the three approved data collections**

Use these exact top-level data structures:

```javascript
  var TOUCHPOINT_CHANNELS = {
    app: {
      moment: "抵达前 72 小时",
      title: "一家人的假期，从从容出发开始",
      message: "入住提醒、机场接送、儿童俱乐部开放时间与早餐偏好已经为您整理好。",
      segment: "已预订的亲子家庭",
      trigger: "入住前 72 小时自动触发",
      objective: "降低行前不确定性并采集服务偏好",
    },
    webpush: {
      moment: "官网浏览后 30 分钟",
      title: "继续刚才心动的海岛家庭套餐",
      message: "您浏览的家庭套房仍可预订，灵活取消政策和儿童餐权益可以继续向智能管家咨询。",
      segment: "浏览房型但未完成预订的家庭",
      trigger: "高意向页面退出后自动召回",
      objective: "承接未完成预订并提升转化信心",
    },
    sms: {
      moment: "关键服务节点",
      title: "重要信息，用更高到达率及时确认",
      message: "接驳车辆已确认，司机将在航班抵达后于 3 号出口等候；服务变更可直接进入智能管家。",
      segment: "需要关键节点确认的宾客",
      trigger: "订单、接驳、工单或紧急状态变化",
      objective: "确保关键信息及时送达并减少服务遗漏",
    },
    whatsapp: {
      moment: "跨境咨询与行前沟通",
      title: "让国际宾客用熟悉的方式开始对话",
      message: "Airport transfer, family room options and children's activities are ready for your trip planning.",
      segment: "海外与多语言宾客",
      trigger: "宾客订阅或跨境旅程节点触发",
      objective: "降低语言与渠道门槛并连接连续服务",
    },
    email: {
      moment: "长内容与高价值方案",
      title: "把完整度假方案送进家庭决策清单",
      message: "房型对比、亲子活动日历、餐饮套餐和会员权益已整理为一封可回看的度假建议。",
      segment: "需要详细方案的家庭与团体客户",
      trigger: "资料申请、方案生成或会务线索形成",
      objective: "支撑长决策链并沉淀打开与点击行为",
    },
    ma: {
      moment: "全旅程自动编排",
      title: "每个行为，都成为下一次恰当服务的信号",
      message: "从预订提醒到住中关怀、满意度回访与下一季家庭活动，旅程按宾客状态持续推进。",
      segment: "不同生命周期与偏好的宾客分群",
      trigger: "行为、标签、订单与服务状态共同驱动",
      objective: "形成从获客、服务到复购的持续经营闭环",
    },
  };

  var CONCIERGE_MODES = {
    agent: {
      status: "GPTBots · 24/7 Online",
      title: "懂目的地，也记得每个家庭的偏好",
      role: "多语言问答、知识检索、个性化推荐、需求采集与服务流程引导。",
      guest: "两个孩子分别 5 岁和 9 岁，明天上午有什么适合全家的活动？",
      reply: "结合天气、年龄和您上次偏好的户外项目，我建议 09:30 的家庭帆船体验；我也可以一起确认早餐时段和接驳。",
      action: "采集参加人数并发起活动预约",
      actionStatus: "AI Handling",
      steps: [
        { text: "理解意图与家庭信息", state: "complete" },
        { text: "调用度假村知识与偏好", state: "active" },
        { text: "复杂场景转人工并保留上下文", state: "" },
      ],
      assurance: "标准需求由 AI 即时闭环，敏感、紧急或高价值场景由人工无缝接手。",
    },
    livedesk: {
      status: "Livedesk · Human Priority",
      title: "复杂时刻，由真正理解现场的人继续服务",
      role: "投诉、紧急住中服务、复杂政策、高价值机会，以及工单优先级、SLA 与闭环。",
      guest: "孩子身体不舒服，房间也需要尽快调整到离电梯更近的位置。",
      reply: "AI 已整理房号、家庭成员、当前需求和可用房型。人工坐席已接手，并将同步前台与值班经理优先处理。",
      action: "创建高优先级工单并同步现场团队",
      actionStatus: "Human Assigned",
      steps: [
        { text: "AI 汇总诉求与完整会话", state: "complete" },
        { text: "Livedesk 分配高优先级坐席", state: "complete" },
        { text: "现场团队处理并回写结果", state: "active" },
      ],
      assurance: "宾客无需重复描述问题，人工团队从完整上下文继续处理并负责结果。",
    },
  };

  var GUEST_JOURNEY = {
    prestay: {
      image: "../imgs/journey-prestay-family-v2.png",
      alt: "一家人共同规划度假行程",
      moment: "Pre-stay · 住前",
      title: "把行前不确定，变成值得期待的准备",
      scenario: "从目的地与套餐咨询，到未完成预订召回、交通指引、儿童活动和餐饮偏好采集。",
      engagelab: "识别旅程节点并主动触达",
      gptbots: "承接问答、推荐与信息采集",
      livedesk: "处理复杂政策与高价值机会",
      outcome: "提高响应与预订信心，让服务准备发生在到店之前",
    },
    instay: {
      image: "../imgs/journey-instay-family-v2.png",
      alt: "一家人在度假村活动区享受住中服务",
      moment: "In-stay · 住中",
      title: "每一个即时需求，都能找到最快的处理路径",
      scenario: "设施与活动问答、餐饮和客房需求、维修工单、服务进度，以及紧急或敏感问题升级。",
      engagelab: "在欢迎、活动与服务节点发送关怀",
      gptbots: "即时受理高频需求并创建结构化任务",
      livedesk: "接管紧急场景并协调现场闭环",
      outcome: "缩短等待与重复沟通，让现场团队把精力留给真正需要判断的服务",
    },
    poststay: {
      image: "../imgs/journey-poststay-family-v2.png",
      alt: "一家人在家回顾度假记忆并规划下一次旅行",
      moment: "Post-stay · 住后",
      title: "离店不是结束，而是下一次家庭记忆的开始",
      scenario: "满意度回访、发票积分与遗失物咨询、会员权益提醒、个性化复购和季节活动培育。",
      engagelab: "按满意度、偏好与季节编排持续旅程",
      gptbots: "处理售后问答并推荐下一次合适方案",
      livedesk: "跟进客诉恢复与高价值复购机会",
      outcome: "沉淀可复用家庭偏好，把一次入住转化为长期宾客关系",
    },
  };
```

- [ ] **Step 2: Add shared rendering and tab utilities**

Add after the data collections:

```javascript
  var SCRIPT_BASE_URL =
    document.currentScript && document.currentScript.src ? document.currentScript.src : document.baseURI;
  var transitionTimers = new WeakMap();

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value != null) element.textContent = value;
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function transitionPanel(panel, render) {
    if (!panel || prefersReducedMotion()) {
      render();
      if (panel) panel.classList.remove("is-transitioning");
      return;
    }

    var currentTimer = transitionTimers.get(panel);
    if (currentTimer) window.clearTimeout(currentTimer);
    panel.classList.add("is-transitioning");

    var timer = window.setTimeout(function () {
      render();
      window.requestAnimationFrame(function () {
        panel.classList.remove("is-transitioning");
        transitionTimers.delete(panel);
      });
    }, 90);
    transitionTimers.set(panel, timer);
  }

  function setupTabs(config) {
    var root = document.getElementById(config.rootId);
    var panel = document.getElementById(config.panelId);
    if (!root || !panel) return;

    var tabs = Array.prototype.slice.call(root.querySelectorAll(config.tabSelector));
    if (!tabs.length) return;

    function activate(key, focusTab) {
      var activeTab = null;
      tabs.forEach(function (tab) {
        var active = tab.getAttribute(config.dataAttribute) === key;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active) activeTab = tab;
      });

      if (!activeTab) return;
      panel.setAttribute("aria-labelledby", activeTab.id);
      transitionPanel(panel, function () {
        config.render(key);
      });
      if (focusTab) activeTab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute(config.dataAttribute), false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activate(tabs[nextIndex].getAttribute(config.dataAttribute), true);
      });
    });

    activate(config.defaultKey, false);
  }
```

- [ ] **Step 3: Add one renderer per DOM region**

Add:

```javascript
  function renderTouchpoint(key) {
    var data = TOUCHPOINT_CHANNELS[key];
    if (!data) return;
    setText("touchpoint-moment", data.moment);
    setText("touchpoint-title", data.title);
    setText("touchpoint-message", data.message);
    setText("touchpoint-segment", data.segment);
    setText("touchpoint-trigger", data.trigger);
    setText("touchpoint-objective", data.objective);
  }

  function renderConcierge(key) {
    var data = CONCIERGE_MODES[key];
    if (!data) return;
    setText("concierge-status", data.status);
    setText("concierge-title", data.title);
    setText("concierge-role", data.role);
    setText("concierge-guest", data.guest);
    setText("concierge-reply", data.reply);
    setText("concierge-action", data.action);
    setText("concierge-action-status", data.actionStatus);
    setText("concierge-assurance", data.assurance);

    var steps = document.getElementById("concierge-steps");
    if (steps) {
      steps.replaceChildren();
      data.steps.forEach(function (step) {
        var item = document.createElement("li");
        item.textContent = step.text;
        if (step.state) item.classList.add("is-" + step.state);
        steps.appendChild(item);
      });
    }
  }

  function renderJourney(key) {
    var data = GUEST_JOURNEY[key];
    if (!data) return;
    var image = document.getElementById("journey-image");
    if (image) {
      image.src = new URL(data.image, SCRIPT_BASE_URL).href;
      image.alt = data.alt;
    }
    setText("journey-moment", data.moment);
    setText("journey-title", data.title);
    setText("journey-scenario", data.scenario);
    setText("journey-engagelab", "EngageLab · " + data.engagelab);
    setText("journey-gptbots", "GPTBots · " + data.gptbots);
    setText("journey-livedesk", "Livedesk · " + data.livedesk);
    setText("journey-outcome", data.outcome);
  }
```

- [ ] **Step 4: Initialize all three modules on DOM ready**

At the start of the existing `DOMContentLoaded` callback, add:

```javascript
    setupTabs({
      rootId: "engagement-hub",
      panelId: "engagement-panel",
      tabSelector: "[data-touchpoint]",
      dataAttribute: "data-touchpoint",
      defaultKey: "app",
      render: renderTouchpoint,
    });

    setupTabs({
      rootId: "concierge-lobby",
      panelId: "concierge-panel",
      tabSelector: "[data-concierge-mode]",
      dataAttribute: "data-concierge-mode",
      defaultKey: "agent",
      render: renderConcierge,
    });

    setupTabs({
      rootId: "guest-journey",
      panelId: "journey-panel",
      tabSelector: "[data-journey-stage]",
      dataAttribute: "data-journey-stage",
      defaultKey: "prestay",
      render: renderJourney,
    });
```

Delete the old `CAP_CHANNELS`, `backgroundChangeTimer`, `setChannelPanel`, and `#capabilities` initialization code. Keep and adapt the progress navigation, booking modal, lightbox, and Escape-key handling.

- [ ] **Step 5: Export the data contract for the Node harness**

Before the `DOMContentLoaded` registration, add:

```javascript
  window.AuroraResortDemo = {
    TOUCHPOINT_CHANNELS: TOUCHPOINT_CHANNELS,
    CONCIERGE_MODES: CONCIERGE_MODES,
    GUEST_JOURNEY: GUEST_JOURNEY,
  };
```

- [ ] **Step 6: Ensure progress navigation uses the five new sections**

Keep the existing progress algorithm, but make it defensive for the test harness:

```javascript
    var progressNav = document.querySelector ? document.querySelector(".sol-progress") : null;
```

Do the same for lightbox initialization:

```javascript
    var lightbox = document.getElementById ? document.getElementById("sol-lightbox") : null;
    var lightboxImg = document.getElementById ? document.getElementById("sol-lightbox-img") : null;
```

- [ ] **Step 7: Run syntax and data-key tests**

Run:

```bash
node --check static/js/solution-travel-hotel.js
python3 -m unittest \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_interaction_modules_and_accessibility_hooks_are_present \
  tests.test_travel_hotel_demo.TravelHotelDemoTest.test_javascript_exports_exact_data_keys
```

Expected: JavaScript syntax check PASS and both tests PASS.

- [ ] **Step 8: Commit the interaction architecture**

```bash
git add static/js/solution-travel-hotel.js
git commit -m "feat: add resort journey interactions"
```

---

### Task 6: Synchronize Source And Static Documentation

**Files:**
- Modify: `docs/static/css/solution-travel-hotel.css`
- Modify: `docs/static/js/solution-travel-hotel.js`
- Modify: `docs/solutions/travel-hotel/index.html`
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Copy source CSS and JavaScript to the docs tree**

Run:

```bash
cp static/css/solution-travel-hotel.css docs/static/css/solution-travel-hotel.css
cp static/js/solution-travel-hotel.js docs/static/js/solution-travel-hotel.js
```

- [ ] **Step 2: Render the Flask route into the standalone docs page**

Run:

```bash
python3 -c 'from pathlib import Path; from app import app; client = app.test_client(); response = client.get("/solutions/travel-hotel"); assert response.status_code == 200; html = response.get_data(as_text=True); html = html.replace("href=\"/static/", "href=\"../../static/").replace("src=\"/static/", "src=\"../../static/"); Path("docs/solutions/travel-hotel/index.html").write_text(html, encoding="utf-8")'
```

Expected: `docs/solutions/travel-hotel/index.html` is regenerated with `../../static/` asset paths and all five approved section IDs.

- [ ] **Step 3: Run the full page test suite**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
```

Expected: all tests PASS.

- [ ] **Step 4: Scan visible artifacts for excluded customer names and legacy page hooks**

Run:

```bash
rg -n "FOLIDAY|复星旅游文化|Club Med|地中海俱乐部|Holiday Inn|假日酒店|IHG|sol-cap-console|id=\"build-ai-agent\"|id=\"livedesk-arch\"" \
  templates/solutions/travel-hotel.html \
  static/js/solution-travel-hotel.js \
  docs/solutions/travel-hotel/index.html \
  docs/static/js/solution-travel-hotel.js
```

Expected: no output.

- [ ] **Step 5: Verify source/export byte synchronization**

Run:

```bash
cmp static/css/solution-travel-hotel.css docs/static/css/solution-travel-hotel.css
cmp static/js/solution-travel-hotel.js docs/static/js/solution-travel-hotel.js
```

Expected: both commands exit with status 0 and print no output.

- [ ] **Step 6: Commit static export**

```bash
git add \
  docs/static/css/solution-travel-hotel.css \
  docs/static/js/solution-travel-hotel.js \
  docs/solutions/travel-hotel/index.html
git commit -m "docs: export family resort solution demo"
```

---

### Task 7: Browser Verification At Port 5002

**Files:**
- Verify: `templates/solutions/travel-hotel.html`
- Verify: `static/css/solution-travel-hotel.css`
- Verify: `static/js/solution-travel-hotel.js`
- Verify: `docs/solutions/travel-hotel/index.html`

- [ ] **Step 1: Start the preview server on the non-production demo port**

Run:

```bash
python3 -m flask --app app run --host 127.0.0.1 --port 5002
```

Expected: Flask serves `http://127.0.0.1:5002/solutions/travel-hotel`. Do not replace the user's existing service on port 5001 during visual review.

- [ ] **Step 2: Open the page with the in-app Browser and verify the initial render**

Follow `browser:control-in-app-browser` and open:

```text
http://127.0.0.1:5002/solutions/travel-hotel
```

Confirm:

```text
The hero fills the viewport width and shows the family resort clearly.
The hero leaves a visible cue for the next scene.
The EngageLab scene appears before the lobby.
The lobby is full width and contains no engagement-channel controls.
The page ends with the group-level value band.
No browser console errors are present.
```

- [ ] **Step 3: Verify all mouse interactions**

Click every EngageLab control and confirm each changes only:

```text
touchpoint-moment
touchpoint-title
touchpoint-message
touchpoint-segment
touchpoint-trigger
touchpoint-objective
```

Click `GPTBots AI Agent` and `Livedesk 人工护航`; confirm conversation, action, status, steps, and assurance update while no EngageLab channels appear in the lobby.

Click `住前`, `住中`, and `住后`; confirm image, scenario, three-product collaboration copy, and outcome all update.

Click `预约方案演示`; confirm the booking modal opens. Press Escape; confirm it closes and focus returns to the button.

- [ ] **Step 4: Verify keyboard semantics**

For each tablist:

```text
Tab moves focus into the active tab.
ArrowRight and ArrowDown activate the next tab.
ArrowLeft and ArrowUp activate the previous tab.
Home activates the first tab.
End activates the last tab.
Only the active tab has tabindex="0".
aria-selected and aria-labelledby update correctly.
Visible focus is obvious over both light and dark scenes.
```

- [ ] **Step 5: Verify the four required viewports**

Capture and inspect:

```text
1440 x 900
1920 x 1080
820 x 1180
390 x 844
```

At each viewport, run an overflow check equivalent to:

```javascript
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Expected: `true`.

Also confirm:

```text
No text overlaps adjacent controls or scene content.
Hero and lobby images remain correctly framed and visibly meaningful.
Mobile channel/mode controls form stable two-column layouts.
Mobile journey controls remain three equal columns without clipped text.
Conversation and outcome content remain readable over every state.
No nested decorative cards or oversized compact-panel headings appear.
```

- [ ] **Step 6: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload, and click controls.

Expected:

```text
Content changes immediately without opacity/translation animation.
No interaction becomes unavailable.
The page retains the same readable state and focus behavior.
```

- [ ] **Step 7: Run final automated verification**

Run:

```bash
python3 -m unittest tests.test_travel_hotel_demo
node --check static/js/solution-travel-hotel.js
git diff --check
```

Expected: all tests PASS, JavaScript syntax check PASS, and `git diff --check` prints no output.

- [ ] **Step 8: Commit browser-polish fixes only if verification required changes**

```bash
git add \
  templates/solutions/travel-hotel.html \
  static/css/solution-travel-hotel.css \
  static/js/solution-travel-hotel.js \
  docs/solutions/travel-hotel/index.html \
  docs/static/css/solution-travel-hotel.css \
  docs/static/js/solution-travel-hotel.js \
  tests/test_travel_hotel_demo.py
git commit -m "fix: polish resort demo across viewports"
```

If Step 2 through Step 6 required no code changes, skip this commit.

---

## Completion Checklist

- [ ] The five scenes appear in the approved order.
- [ ] Aurora Hotel is the only customer-style brand presented.
- [ ] EngageLab channels are isolated to the engagement scene.
- [ ] GPTBots and Livedesk are isolated to the lobby scene.
- [ ] Pre-stay, in-stay, and post-stay interactions update independently.
- [ ] All six generated images are clean backgrounds with no embedded UI or readable text.
- [ ] Desktop, wide desktop, tablet, and mobile have no horizontal overflow or incoherent overlap.
- [ ] Keyboard, focus, modal, and reduced-motion behavior are verified.
- [ ] Source and docs CSS/JavaScript are byte-for-byte synchronized.
- [ ] The Livedesk website widget still loads from the existing integration.
- [ ] Automated tests, JavaScript syntax checks, and `git diff --check` pass.
