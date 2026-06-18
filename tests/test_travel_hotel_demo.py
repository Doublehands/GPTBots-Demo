from pathlib import Path
import json
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class TravelHotelDemoTest(unittest.TestCase):
    def read(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_template_has_approved_five_scene_architecture_in_order(self):
        template = self.read("templates/solutions/travel-hotel.html")
        section_ids = [
            'id="resort-hero"',
            'id="engagement-hub"',
            'id="concierge-lobby"',
            'id="guest-journey"',
            'id="group-value"',
        ]

        positions = [template.find(section_id) for section_id in section_ids]
        self.assertNotIn(-1, positions, "Missing one or more approved five-scene IDs")
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
                self.assertTrue(text in template, f"Missing template copy: {text!r}")

        for legacy_id in [
            'id="capabilities"',
            'id="livedesk-arch"',
            'id="journey"',
            'id="build-ai-agent"',
        ]:
            with self.subTest(legacy_id=legacy_id):
                self.assertTrue(
                    legacy_id not in template,
                    f"Legacy section ID remains: {legacy_id!r}",
                )

        self.assertTrue(
            "sol-bg__orb" not in template,
            "Legacy decorative orb markup remains",
        )

    def test_engagement_and_lobby_controls_have_strict_product_boundaries(self):
        template = self.read("templates/solutions/travel-hotel.html")
        section_ids = [
            'id="engagement-hub"',
            'id="concierge-lobby"',
            'id="guest-journey"',
        ]
        missing_section_ids = [
            section_id for section_id in section_ids if section_id not in template
        ]
        self.assertEqual(
            missing_section_ids,
            [],
            f"Missing scene IDs required for markup slicing: {missing_section_ids}",
        )

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
                self.assertTrue(
                    hook in template,
                    f"Missing template accessibility hook: {hook!r}",
                )

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
                self.assertTrue(term in js, f"Missing JavaScript term: {term!r}")

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
const demo = window.AuroraResortDemo || {};
console.log(JSON.stringify({
  touchpoints: Object.keys(demo.TOUCHPOINT_CHANNELS || {}),
  concierge: Object.keys(demo.CONCIERGE_MODES || {}),
  journey: Object.keys(demo.GUEST_JOURNEY || {}),
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
                self.assertTrue(selector in css, f"Missing CSS selector: {selector!r}")

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
                self.assertTrue(
                    section_id in docs_html,
                    f"Missing docs scene ID: {section_id!r}",
                )

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
            self.assertTrue(
                "Aurora Hotel" in content,
                f"Missing fictional brand in {artifact}",
            )
            for term in forbidden_terms:
                with self.subTest(artifact=artifact, term=term):
                    self.assertTrue(
                        term not in content,
                        f"Forbidden brand term {term!r} found in {artifact}",
                    )


if __name__ == "__main__":
    unittest.main()
