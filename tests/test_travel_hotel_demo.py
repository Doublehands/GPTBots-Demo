from pathlib import Path
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class TravelHotelDemoTest(unittest.TestCase):
    def read(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_template_positions_aurora_hotel_solution(self):
        template = self.read("templates/solutions/travel-hotel.html")

        required_copy = [
            "Aurora 酒店全旅程智能服务与营销赋能方案",
            "Aurora Hotel",
            "APP Push",
            "WebPush",
            "SMS",
            "WhatsApp",
            "Email",
            "MA 用户旅程",
            "GPTBots",
            "EngageLab",
            "Livedesk",
        ]

        for text in required_copy:
            with self.subTest(text=text):
                self.assertTrue(text in template, f"Missing template copy: {text!r}")

    def test_capability_console_hooks_and_asset_exist(self):
        template = self.read("templates/solutions/travel-hotel.html")
        css = self.read("static/css/solution-travel-hotel.css")

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
                self.assertTrue(hook in template, f"Missing template hook: {hook!r}")

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

        for selector in [
            ".sol-cap-console",
            ".sol-cap-console__background",
            ".sol-cap-channel",
            ".sol-cap-dashboard",
            ".sol-cap-phone",
            ".sol-cap-journey",
        ]:
            with self.subTest(selector=selector):
                self.assertTrue(selector in css, f"Missing CSS selector: {selector!r}")

        self.assertNotIn("sol-cap-row", template, "Old five-tab capability UI should be removed")

    def test_channel_backgrounds_and_full_width_hero_are_wired(self):
        template = self.read("templates/solutions/travel-hotel.html")
        css = self.read("static/css/solution-travel-hotel.css")
        js = self.read("static/js/solution-travel-hotel.js")

        self.assertIn("sol-cap-console__background", template)
        self.assertIn(".sol-hero--cover.sol-bleed", css)
        self.assertIn("padding-left: 0", css)
        self.assertIn("padding-right: 0", css)
        self.assertIn(".sol-cap-console__background", css)
        self.assertIn(".sol-cap-console__background.is-changing", css)
        self.assertIn("var(--sol-cap-bg", css)
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
        self.assertIn("new URL(data.background", js)
        self.assertIn('classList.add("is-changing")', js)
        self.assertIn('classList.remove("is-changing")', js)
        self.assertNotIn("aurora-hotel-clean-background.png", template)

    def test_channel_background_mapping_and_exports_are_exact(self):
        js = self.read("static/js/solution-travel-hotel.js")
        docs_js = self.read("docs/static/js/solution-travel-hotel.js")
        css = self.read("static/css/solution-travel-hotel.css")
        docs_css = self.read("docs/static/css/solution-travel-hotel.css")
        expected = {
            "app": "cap-deluxe-suite.png",
            "webpush": "cap-executive-suite.png",
            "sms": "cap-lobby-entrance.png",
            "whatsapp": "cap-pool.png",
            "email": "cap-hotel-wedding.png",
            "ma": "cap-pool.png",
            "livedesk": "cap-lobby-entrance.png",
            "agent": "cap-deluxe-suite.png",
        }

        for channel, image_name in expected.items():
            with self.subTest(channel=channel):
                pattern = rf"{channel}:\s*\{{\s*background:\s*\"\.\./imgs/{re.escape(image_name)}\""
                self.assertRegex(js, pattern)

        self.assertEqual(js, docs_js)
        self.assertEqual(css, docs_css)

    def test_channel_tabs_have_complete_keyboard_semantics(self):
        template = self.read("templates/solutions/travel-hotel.html")
        docs_html = self.read("docs/solutions/travel-hotel/index.html")
        js = self.read("static/js/solution-travel-hotel.js")

        for html in [template, docs_html]:
            with self.subTest(artifact="template" if html is template else "docs"):
                self.assertIn('id="sol-cap-panel"', html)
                self.assertIn('role="tabpanel"', html)
                self.assertIn('aria-controls="sol-cap-panel"', html)
                self.assertIn('id="sol-cap-tab-app"', html)
                self.assertIn('tabindex="-1"', html)

        for key in ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"]:
            with self.subTest(key=key):
                self.assertIn(key, js)

        self.assertIn('setAttribute("tabindex"', js)
        self.assertIn('setAttribute("aria-labelledby"', js)

    def test_channel_state_machine_handles_rapid_clicks_and_reduced_motion(self):
        js_path = ROOT / "static/js/solution-travel-hotel.js"
        harness = r"""
const fs = require("node:fs");

function classList(initial = []) {
  const values = new Set(initial);
  return {
    add(value) { values.add(value); },
    remove(value) { values.delete(value); },
    contains(value) { return values.has(value); },
    toggle(value, active) { active ? values.add(value) : values.delete(value); },
  };
}

const channels = ["app", "webpush", "sms", "whatsapp", "email", "ma", "livedesk", "agent"];
const buttons = channels.map((channel, index) => ({
  channel,
  attrs: {
    "data-cap-channel": channel,
    "aria-selected": index === 0 ? "true" : "false",
    tabindex: index === 0 ? "0" : "-1",
  },
  classList: classList(index === 0 ? ["is-active"] : []),
  listeners: {},
  getAttribute(name) { return this.attrs[name]; },
  setAttribute(name, value) { this.attrs[name] = String(value); },
  addEventListener(name, callback) { this.listeners[name] = callback; },
  focus() { this.focused = true; },
}));
const steps = ["awareness", "engage", "assist", "serve", "follow", "loyalty"].map((step) => ({
  step,
  classList: classList(step === "engage" ? ["is-active"] : []),
  getAttribute(name) { return name === "data-step" ? this.step : null; },
}));
const background = { classList: classList() };
const styleValues = {};
const consoleEl = {
  style: { setProperty(name, value) { styleValues[name] = value; } },
  querySelector(selector) {
    return selector === ".sol-cap-console__background" ? background : null;
  },
};
const panel = {
  attrs: {},
  setAttribute(name, value) { this.attrs[name] = String(value); },
};
const textNodes = new Map();
const root = {
  querySelectorAll(selector) {
    if (selector === ".sol-cap-channel") return buttons;
    if (selector === ".sol-cap-journey__step") return steps;
    return [];
  },
};
let domReady;
let reducedMotion = false;
global.window = {
  setTimeout,
  clearTimeout,
  requestAnimationFrame(callback) { setTimeout(callback, 0); },
  matchMedia() { return { matches: reducedMotion }; },
};
global.document = {
  currentScript: { src: "http://example.test/static/js/solution-travel-hotel.js" },
  baseURI: "http://example.test/solutions/travel-hotel",
  addEventListener(name, callback) {
    if (name === "DOMContentLoaded") domReady = callback;
  },
  querySelector(selector) {
    return selector === ".sol-progress" ? null : null;
  },
  querySelectorAll() { return []; },
  getElementById(id) {
    if (id === "capabilities") return root;
    if (id === "sol-cap-console") return consoleEl;
    if (id === "sol-cap-panel") return panel;
    if (id === "sol-lightbox" || id === "sol-lightbox-img") return null;
    if (!textNodes.has(id)) textNodes.set(id, { textContent: "" });
    return textNodes.get(id);
  },
};

eval(fs.readFileSync(process.argv[1], "utf8"));
domReady();

function click(channel) {
  buttons.find((button) => button.channel === channel).listeners.click();
}

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 180));
  click("webpush");
  await new Promise((resolve) => setTimeout(resolve, 30));
  click("whatsapp");
  await new Promise((resolve) => setTimeout(resolve, 30));
  click("email");
  await new Promise((resolve) => setTimeout(resolve, 220));

  const rapid = {
    background: styleValues["--sol-cap-bg"],
    active: buttons.find((button) => button.classList.contains("is-active")).channel,
    changing: background.classList.contains("is-changing"),
  };

  reducedMotion = true;
  click("webpush");
  const reduced = {
    background: styleValues["--sol-cap-bg"],
    active: buttons.find((button) => button.classList.contains("is-active")).channel,
    changing: background.classList.contains("is-changing"),
  };

  console.log(JSON.stringify({ rapid, reduced }));
})();
"""
        completed = subprocess.run(
            ["node", "-e", harness, str(js_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        result = json.loads(completed.stdout)

        self.assertEqual(result["rapid"]["active"], "email")
        self.assertIn("/static/imgs/cap-hotel-wedding.png", result["rapid"]["background"])
        self.assertFalse(result["rapid"]["changing"])
        self.assertEqual(result["reduced"]["active"], "webpush")
        self.assertIn("/static/imgs/cap-executive-suite.png", result["reduced"]["background"])
        self.assertFalse(result["reduced"]["changing"])

    def test_js_uses_aurora_hotel_scenarios_and_product_roles(self):
        js = self.read("static/js/solution-travel-hotel.js")

        required_terms = [
            "Aurora Hotel",
            "APP Push",
            "WebPush",
            "WhatsApp",
            "Email",
            "MA",
            "Livedesk",
            "GPTBots",
            "复购",
            "CAP_CHANNELS",
            "setChannelPanel",
        ]

        for text in required_terms:
            with self.subTest(text=text):
                self.assertTrue(text in js, f"Missing JS term: {text!r}")

    def test_docs_export_is_synced(self):
        docs_html = self.read("docs/solutions/travel-hotel/index.html")

        for text in [
            "Aurora 酒店全旅程智能服务与营销赋能方案",
            "Aurora Hotel",
            "sol-cap-console",
            "sol-cap-console__background",
            "data-cap-channel=\"app\"",
            "data-cap-channel=\"ma\"",
        ]:
            with self.subTest(text=text):
                self.assertTrue(text in docs_html, f"Missing docs content: {text!r}")

        self.assertNotIn("aurora-hotel-clean-background.png", docs_html)

    def test_old_hotel_brand_is_removed_from_web_artifacts(self):
        web_artifacts = [
            "templates/solutions/travel-hotel.html",
            "static/js/solution-travel-hotel.js",
            "docs/solutions/travel-hotel/index.html",
            "docs/static/js/solution-travel-hotel.js",
            "docs/gptbots-aurora-hotel-customer-service-agentflow.md",
            "docs/gptbots-aurora-hotel-customer-service-agentflow.html",
        ]
        old_terms = ["Holiday Inn", "假日酒店", "IHG", "holiday-inn-dialog-simulation.png"]

        for artifact in web_artifacts:
            content = self.read(artifact)
            for term in old_terms:
                with self.subTest(artifact=artifact, term=term):
                    self.assertNotIn(term, content)


if __name__ == "__main__":
    unittest.main()
