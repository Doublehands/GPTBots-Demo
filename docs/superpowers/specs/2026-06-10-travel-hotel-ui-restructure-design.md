# Travel Hotel UI Restructure Design

## Goal

Restructure the Aurora Hotel solution page so the hotel lobby hero covers the full viewport width and the channel console uses multiple, channel-specific hotel scene backgrounds instead of reusing the lobby image.

## Approved Direction

Use the selected "channel-specific background" approach:

- The hero remains the only section that uses `hero-hotel-lobby.png`.
- The hero background must extend to both viewport edges at all responsive sizes.
- The capability console keeps its existing dashboard, phone, journey, and channel controls.
- Selecting a channel updates both the console content and its hotel scene background.
- Background changes use a short fade to avoid a distracting slideshow effect.

## Channel Background Mapping

Reuse the existing optimized hotel assets:

- APP Push: `cap-deluxe-suite.png`
- WebPush: `cap-executive-suite.png`
- SMS: `cap-lobby-entrance.png`
- WhatsApp: `cap-pool.png`
- Email: `cap-hotel-wedding.png`
- MA Journey: `cap-pool.png`
- Live Desk: `cap-lobby-entrance.png`
- AI Agent: `cap-deluxe-suite.png`

The mapping gives every channel a relevant setting while limiting the change to existing assets.

## Implementation

### Hero

Give the hero its own viewport-width behavior instead of inheriting the horizontal padding used by generic bleed sections. The background and scrim remain absolutely positioned and use `background-size: cover`; the text container retains readable inner padding.

### Capability Console

Move the visual background to a dedicated absolutely positioned layer inside `.sol-cap-console`. Keep the scrim above the image and all interactive content above the scrim.

Each `CAP_CHANNELS` entry receives a background value. `setChannelPanel()` updates the console background through a CSS custom property or data attribute when the selected tab changes.

### Transition And Accessibility

- Use a subtle opacity transition for background changes.
- Disable the transition under `prefers-reduced-motion: reduce`.
- Preserve current tab roles, `aria-selected` updates, focus states, and text contrast.
- Keep the mobile layout unchanged apart from the new background layer.

## Files

- `templates/solutions/travel-hotel.html`
- `static/css/solution-travel-hotel.css`
- `static/js/solution-travel-hotel.js`
- `docs/solutions/travel-hotel/index.html`
- `docs/static/css/solution-travel-hotel.css`
- `docs/static/js/solution-travel-hotel.js`
- `tests/test_travel_hotel_demo.py`

## Verification

- Static tests confirm the old clean lobby-style background reference is removed from the capability console and all scene assets are wired into channel data.
- Desktop browser verification confirms the hero reaches both viewport edges and channel clicks change the background.
- Mobile verification confirms the console remains readable and does not overflow horizontally.
- Reduced-motion behavior is checked through the CSS rule.
