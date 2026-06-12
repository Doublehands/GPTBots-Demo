# Global Family Resort Solution Page Redesign

## Goal

Rebuild the travel and hotel solution demo as an immersive, reusable industry presentation for a global, high-quality, family-oriented resort group.

The page must communicate one clear solution promise:

> Active engagement before the guest asks, an intelligent concierge throughout the journey, and human care whenever the situation requires it.

Aurora Hotel remains the fictional demonstration brand. The page must not mention FOLIDAY, Club Med, or any other real customer or portfolio brand.

## Audience

The primary audience is a group-level decision maker responsible for guest experience, digital operations, marketing automation, customer service, or resort operations.

The demo should therefore balance:

- Emotional appeal appropriate for premium family vacations.
- Clear group-level operating logic.
- Concrete guest scenarios.
- Credible separation of EngageLab, GPTBots, and Livedesk responsibilities.
- A reusable industry narrative rather than a single-brand pitch.

## Approved Creative Direction

Use a cinematic, scene-led page rather than a conventional product dashboard or a collection of feature cards.

The page unfolds as a continuous guest story:

1. Global family vacation value proposition.
2. Full-journey engagement hub.
3. Intelligent concierge lobby.
4. Pre-stay, in-stay, and post-stay journey.
5. Group-level business and technology value.

Each major section should feel like a distinct scene while preserving visual continuity through typography, color, motion, and Aurora Hotel branding.

## Brand And Content Rules

- Keep `Aurora Hotel` as the fictional resort brand.
- Position the offer as a solution for a global family resort group.
- Do not mention FOLIDAY or Club Med in visible copy, metadata, image text, or mock data.
- Avoid language that implies the demo belongs to a specific real customer.
- Use scenarios such as family travel, children's activities, international guests, airport transfer, resort dining, room preferences, multilingual service, membership, and repeat stays.
- Use Chinese as the primary presentation language, with restrained English labels where they improve the premium international feel.

## Page Architecture

### 1. Hero: Global Family Vacation

Use a full-bleed, viewport-width destination image with no side gutters. The image should immediately signal:

- Premium resort quality.
- Family-oriented vacation experiences.
- International destinations.
- Warm, optimistic hospitality.

Recommended headline:

`全球化家庭度假集团全旅程智能服务解决方案`

Supporting copy should introduce the three-part model:

- EngageLab provides proactive engagement.
- GPTBots provides the 24/7 intelligent concierge.
- Livedesk provides human care and operational closure.

The hero should leave a visible hint of the next section on common desktop and mobile viewports.

### 2. Scene One: Full-Journey Engagement Hub

This section appears before the hotel lobby scene.

Generate a new wide background image showing a premium family resort destination or a family preparing for a vacation. The image must provide open visual space for interface overlays and must not contain generated UI, readable text, logos, or watermarks.

The interactive layer represents EngageLab:

- APP Push
- WebPush
- SMS
- WhatsApp
- Email
- MA Journey

Selecting a channel updates:

- The active channel state.
- The message preview.
- The target guest segment.
- The vacation journey moment.
- The intended business outcome.

The default scene should explain how a family receives timely booking reminders, travel guidance, membership benefits, children's activity information, or destination recommendations before arrival.

The visual treatment should use translucent panels and compact channel icons without obscuring the resort photography.

### 3. Scene Two: Intelligent Concierge Lobby

The hotel lobby background must be substantially larger than the current console section and cover the viewport from left edge to right edge, matching the visual scale of the hero.

This scene must not show EngageLab channels.

It contains only two interactive service modes:

#### GPTBots AI Agent

Focus on:

- 24/7 multilingual guest Q&A.
- Resort knowledge retrieval.
- Room, dining, activity, and package recommendations.
- Guest preference and requirement collection.
- Workflow execution and service guidance.
- Context-aware recommendations based on historical preferences.

#### Livedesk

Focus on:

- Complaints and sensitive issues.
- Urgent in-stay service.
- Complex booking policies.
- High-value event or membership opportunities.
- Human handoff with the AI-collected context preserved.
- Ticket assignment, priority, SLA, and closure.

Selecting either mode updates the central interface, conversation, service status, and handoff flow. The interaction should make the operating model obvious: AI handles scale and continuity; people provide judgment, empathy, and assurance.

### 4. Scene Three: Pre-Stay, In-Stay, Post-Stay

Replace the current long timeline with a focused three-stage interactive journey.

#### Pre-Stay

- Destination and package discovery.
- Booking reminders and incomplete-booking recovery.
- Transportation and arrival guidance.
- Family preference collection.
- Children's activity and dining recommendations.

#### In-Stay

- Facility and schedule Q&A.
- Dining, housekeeping, maintenance, and activity requests.
- Multilingual concierge service.
- Structured ticket creation and progress tracking.
- Livedesk escalation for urgent or sensitive situations.

#### Post-Stay

- Satisfaction follow-up.
- Invoice, points, and lost-property questions.
- Membership benefit reminders.
- Personalized repeat-stay recommendations.
- Family event and seasonal campaign nurturing.

Clicking a stage updates the scene image, guest conversation, product collaboration flow, and outcome statement.

### 5. Closing: Group-Level Value

End with a restrained, high-impact value band rather than another collection of feature cards.

The closing should summarize:

- Global and multilingual service consistency.
- A unified guest context across channels and teams.
- 24/7 concierge availability.
- Human assurance for complex scenarios.
- Reusable family preference data.
- A closed loop from acquisition and booking through service and repeat purchase.

Use concise proof-oriented labels or demo metrics. Do not present unsupported claims as real customer results.

## Visual System

### Palette

Use a balanced resort palette:

- Ocean and botanical greens.
- Sunlight gold.
- Small coral-red accents.
- Clear white and soft neutral surfaces.

Avoid a page dominated by dark green, slate blue, beige, or a single hue family.

### Imagery

Generate or select images that reveal the actual family resort context:

- Destination or resort exterior for the hero.
- Family vacation or destination scene for the engagement hub.
- Wide premium hotel lobby for the concierge scene.
- Distinct pre-stay, in-stay, and post-stay moments for the journey.

Images must not contain generated interface text. All product UI, labels, icons, and controls must be rendered in HTML/CSS for clarity, accessibility, and interaction.

Small fictional Aurora Hotel marks or channel illustrations may be generated as raster assets when they improve visual polish. Familiar interface icons should use the project's existing icon approach or a consistent icon library rather than text abbreviations.

### Typography And Layout

- Use hero-scale type only in the opening scene.
- Use compact, high-contrast headings inside control surfaces.
- Keep letter spacing at zero except for small uppercase eyebrows.
- Use full-width scene bands with constrained internal content.
- Do not place page sections inside decorative cards.
- Keep card radii at 8px or less.
- Avoid nested cards.

### Motion

Use motion to reinforce continuity:

- Background crossfades.
- Short content fades and vertical translations.
- Active-tab progress indicators.
- Subtle message and ticket state transitions.
- Optional number count-up in the closing value band.

Do not use scroll hijacking, long autoplay sequences, decorative particle effects, or motion that obscures the story.

Respect `prefers-reduced-motion`.

## Interaction Architecture

Split the page interactions into three independent data-driven modules.

### `TOUCHPOINT_CHANNELS`

Owns the engagement hub:

- Channel label and icon.
- Target segment.
- Trigger or journey moment.
- Message preview.
- Business objective.
- Optional background or foreground visual state.

### `CONCIERGE_MODES`

Owns the lobby:

- GPTBots AI Agent mode.
- Livedesk mode.
- Conversation content.
- Recommendation, ticket, or handoff state.
- Human/AI responsibility statement.

### `GUEST_JOURNEY`

Owns the three-stage journey:

- Pre-stay.
- In-stay.
- Post-stay.
- Scene image.
- Guest scenario.
- Product collaboration.
- Outcome statement.

Each module should update only its own DOM region. Shared utilities may handle tab state, text replacement, image transitions, and keyboard navigation.

## Accessibility And Resilience

- Use semantic tablists, tabs, and tabpanels where appropriate.
- Maintain `aria-selected`, `aria-controls`, and roving `tabindex`.
- Support arrow-key navigation between tabs.
- Provide visible focus states.
- Ensure all overlay text remains readable over every background state.
- Use stable default content so the page remains understandable without JavaScript.
- Provide background colors and complete text content if an image fails to load.
- Honor reduced-motion preferences.

## Responsive Behavior

### Desktop

- Hero and lobby scenes span the viewport.
- Engagement controls can sit beside or over the scene without covering the primary family imagery.
- Lobby controls keep the GPTBots/Livedesk distinction immediately visible.
- The journey uses a horizontal three-stage layout.

### Tablet

- Channel and mode controls move into compact horizontal or two-column tabs.
- Content surfaces remain readable without requiring precise pointer interaction.

### Mobile

- Scene images remain visible and correctly framed.
- Controls become horizontally scrollable or wrap into a stable two-column layout.
- Control panels become single-column.
- Text, buttons, and messages must not overlap or cause horizontal page overflow.
- The next section should remain discoverable without excessively tall first-view scenes.

## Scope Of Restructure

The existing page sections should be consolidated into the approved five-scene architecture.

Remove or absorb:

- The current mixed channel/lobby capability console.
- The separate generic collaboration architecture section.
- The long multi-step journey timeline.
- The standalone build-an-agent feature catalogue where it repeats information already shown in the scenes.

Retain reusable implementation pieces where helpful:

- The Livedesk widget integration.
- Lightbox and modal utilities if still required.
- Static export workflow.
- Existing accessible tab behavior that matches the new modules.

## Files Expected To Change

- `templates/solutions/travel-hotel.html`
- `static/css/solution-travel-hotel.css`
- `static/js/solution-travel-hotel.js`
- `tests/test_travel_hotel_demo.py`
- `docs/solutions/travel-hotel/index.html`
- `docs/static/css/solution-travel-hotel.css`
- `docs/static/js/solution-travel-hotel.js`
- New image assets under `static/imgs/` and `docs/static/imgs/`

The GPTBots AgentFlow design and visualization are outside this page restructure unless a later request explicitly asks to align them.

## Verification

### Automated

- The rendered page includes all five approved sections in the correct order.
- The engagement hub contains only EngageLab channels.
- The lobby contains only GPTBots AI Agent and Livedesk modes.
- Channel selection updates the engagement content.
- Concierge mode selection updates the lobby content.
- Pre-stay, in-stay, and post-stay selection updates the journey content.
- Static and docs assets remain synchronized.
- Visible artifacts do not contain FOLIDAY or Club Med.
- Aurora Hotel remains consistent as the fictional brand.
- JavaScript syntax checks pass.

### Browser

Verify at minimum:

- Desktop: 1440 x 900.
- Wide desktop: 1920 x 1080.
- Tablet: 820 x 1180.
- Mobile: 390 x 844.

For each viewport:

- No incoherent overlap.
- No horizontal page overflow.
- Hero and lobby images are correctly framed.
- Engagement, concierge, and journey controls are clickable.
- Keyboard interaction works.
- Image transitions and reduced-motion behavior work.
- No console errors.

## Success Criteria

The finished demo should let a group-level customer understand the solution without a presenter explaining the UI:

1. EngageLab proactively reaches the right family at the right journey moment.
2. GPTBots becomes the always-available intelligent vacation concierge.
3. Livedesk provides human judgment and service assurance.
4. The three products form one continuous pre-stay, in-stay, and post-stay experience.
5. The visual experience feels premium, global, family-oriented, and reusable for industry sales demonstrations.
