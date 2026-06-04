# Holiday Inn Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the travel-hotel demo into a Holiday Inn full-journey solution showcase with an optimized five-core-capabilities UI and a new generated simulated conversation image.

**Architecture:** Keep the existing Flask/static architecture. Update the Jinja template, page stylesheet, and page JavaScript in place, then sync the static `docs/` export. Add a small Python unittest file to validate the demo copy, UI hooks, and asset references.

**Tech Stack:** Flask/Jinja templates, plain CSS, plain JavaScript, Python `unittest`, generated PNG asset.

---

### Task 1: Add Static Validation

**Files:**
- Create: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Write a failing static validation test**

Create tests that read `templates/solutions/travel-hotel.html`, `static/js/solution-travel-hotel.js`, `static/css/solution-travel-hotel.css`, and `docs/solutions/travel-hotel/index.html`. Assert the new Holiday Inn positioning, product-channel copy, UI class hooks, and generated image reference exist.

- [ ] **Step 2: Run the test and verify it fails**

Run: `python -m unittest tests.test_travel_hotel_demo`

Expected: FAIL because the new copy, UI classes, and image asset are not implemented yet.

### Task 2: Generate And Install Image Asset

**Files:**
- Create: `static/imgs/holiday-inn-dialog-simulation.png`
- Create: `docs/static/imgs/holiday-inn-dialog-simulation.png`

- [ ] **Step 1: Generate the image**

Use the built-in image generation path to create a polished Holiday Inn intelligent service console image: hotel lobby plus guest chat/service workflow overlay, no watermark, no unreadable tiny text.

- [ ] **Step 2: Move the generated image into the project**

Save the final PNG to `static/imgs/holiday-inn-dialog-simulation.png` and copy it to `docs/static/imgs/holiday-inn-dialog-simulation.png`.

### Task 3: Update Page Template And Static Export

**Files:**
- Modify: `templates/solutions/travel-hotel.html`
- Modify: `docs/solutions/travel-hotel/index.html`

- [ ] **Step 1: Update hero and five-capability intro copy**

Make the page explicitly address Holiday Inn and explain the GPTBots + EngageLab + Livedesk split.

- [ ] **Step 2: Add capability UI hooks**

Add the generated image, scenario/meta labels, and product role cards using classes such as `sol-cap-showcase`, `sol-cap-product-card`, and `sol-cap-outcomes`.

### Task 4: Update Styling And Interaction Data

**Files:**
- Modify: `static/css/solution-travel-hotel.css`
- Modify: `static/js/solution-travel-hotel.js`
- Modify: `docs/static/css/solution-travel-hotel.css`
- Modify: `docs/static/js/solution-travel-hotel.js`

- [ ] **Step 1: Style the five-capability console**

Refine layout, spacing, active states, generated image framing, product cards, and mobile responsiveness.

- [ ] **Step 2: Update capability text data**

Make all five tab states describe Holiday Inn-specific scenarios and include GPTBots, EngageLab, and Livedesk handoff language.

### Task 5: Verify

**Files:**
- Test: `tests/test_travel_hotel_demo.py`

- [ ] **Step 1: Run static tests**

Run: `python -m unittest tests.test_travel_hotel_demo`

Expected: PASS.

- [ ] **Step 2: Start the Flask demo**

Run: `python app.py`

Expected: local server starts on port `5001`.

- [ ] **Step 3: Browser-check the page**

Open `http://127.0.0.1:5001/solutions/travel-hotel` and verify the page renders, the five capability tabs update content, and the generated image appears.
