from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class TravelHotelDemoTest(unittest.TestCase):
    def read(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_template_positions_holiday_inn_solution(self):
        template = self.read("templates/solutions/travel-hotel.html")

        required_copy = [
            "假日酒店全旅程智能服务与营销赋能方案",
            "Holiday Inn",
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
        image_path = ROOT / "static/imgs/holiday-inn-dialog-simulation.png"

        for hook in [
            "sol-cap-showcase",
            "sol-cap-product-card",
            "sol-cap-outcomes",
            "holiday-inn-dialog-simulation.png",
        ]:
            with self.subTest(hook=hook):
                self.assertTrue(hook in template, f"Missing template hook: {hook!r}")

        for selector in [
            ".sol-cap-showcase",
            ".sol-cap-product-card",
            ".sol-cap-outcomes",
        ]:
            with self.subTest(selector=selector):
                self.assertTrue(selector in css, f"Missing CSS selector: {selector!r}")

        self.assertTrue(image_path.exists(), "Generated simulation image should exist in static/imgs")

    def test_js_uses_holiday_inn_scenarios_and_product_roles(self):
        js = self.read("static/js/solution-travel-hotel.js")

        required_terms = [
            "假日酒店",
            "APP Push",
            "WebPush",
            "MA",
            "Livedesk",
            "GPTBots",
            "复购",
        ]

        for text in required_terms:
            with self.subTest(text=text):
                self.assertTrue(text in js, f"Missing JS term: {text!r}")

    def test_docs_export_is_synced(self):
        docs_html = self.read("docs/solutions/travel-hotel/index.html")
        docs_image = ROOT / "docs/static/imgs/holiday-inn-dialog-simulation.png"

        for text in [
            "假日酒店全旅程智能服务与营销赋能方案",
            "Holiday Inn",
            "holiday-inn-dialog-simulation.png",
            "sol-cap-showcase",
        ]:
            with self.subTest(text=text):
                self.assertTrue(text in docs_html, f"Missing docs content: {text!r}")

        self.assertTrue(docs_image.exists(), "Generated simulation image should be synced to docs/static/imgs")


if __name__ == "__main__":
    unittest.main()
