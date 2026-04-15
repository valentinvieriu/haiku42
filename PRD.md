# Haiku42 - Product Requirements Document

## Vision

Haiku42 is a contemplative web experience that pairs AI-generated contemporary haikus with matching AI-generated imagery. Each visit delivers a unique moment of reflection — a modern poem set against a cinematic backdrop. The experience is minimal, immersive, and endlessly generative.

## Target Audience

Anyone seeking a brief creative pause — poetry enthusiasts, design-minded users, or people who enjoy generative art. The app works as a daily ritual, a screensaver-like experience, or a way to share a poetic moment with someone.

## Core Experience

### First Visit

1. User lands on the homepage
2. A haiku is generated immediately — no action required
3. The user is redirected to a unique URL for that haiku
4. A full-screen background image appears, matched to the haiku's theme
5. The haiku text appears over the image with a line-by-line typewriter animation

### Ongoing Interaction

- **Click or tap anywhere** to generate a new haiku and image pair
- Each new haiku gets its own unique URL
- The background transitions with a fade, then plays a slow cinematic animation (random zoom or pan)
- The haiku text types out fresh each time

### Sharing

- Every haiku has a permanent, shareable URL (e.g. `haiku42.net/haiku/{id}`)
- When someone opens a shared link, they see the exact same haiku and image
- Social sharing metadata (title, description, preview image) is included for link previews

## Content

### Haiku Generation

- All haikus follow the traditional **5-7-5 syllable** structure
- Topics are contemporary and diverse, spanning 20+ categories:
  - Nature and seasons
  - Technology and digital life
  - Urban life
  - Human emotions and relationships
  - Climate and environment
  - Mindfulness and solitude
  - Food and cuisine
  - Work and economy
  - Art and creativity
  - Identity and self
  - Space and cosmos
  - Global issues
  - And more
- Topics are selected via weighted randomization for thematic variety
- Tone is reflective and evocative — modern sensibility with poetic restraint

### Image Generation

- Each haiku includes an image prompt derived from its content
- The image is generated in **portrait orientation** (960x1440 default)
- Images are styled through one of **18 aesthetic templates** selected deterministically from the haiku content:
  - Cyberpunk, surreal collage, minimalist noir, synesthesia, movie poster, glitch art, ink wash, dreamscape, steampunk, and others
- The same haiku always produces the same image (deterministic)

## Visual Design

### Layout

- **Full-screen immersive** — the image fills the entire viewport
- Haiku text is positioned in a **semi-transparent white bar near the bottom** of the screen
- No navigation chrome, no menus, no buttons — the entire screen is the interaction surface

### Typography

- Serif font for the haiku text
- Large, readable text (responsive: larger on desktop, smaller on mobile)
- Each line of the haiku is a separate paragraph with spacing between lines

### Animations

- **Typewriter effect:** Each haiku line types out character by character (~42ms per character), one line at a time
- **Background motion:** Each image plays a slow 20-second animation, randomly selected:
  - Zoom in or zoom out
  - Pan left, right, up, or down
- **Transitions:** Fade between haiku states and image loads
- **Loading state:** Pulsing gray skeleton lines while the haiku loads

### Color

- Primary theme: blue (#3498db)
- Background gradient fallback: white to light gray (visible while image loads)
- Text overlay: white background at 95% opacity
- Dark text on light overlay for readability

## Progressive Web App

- Installable on mobile and desktop
- Portrait-primary orientation
- Standalone display mode (no browser chrome)
- App shortcut: "Generate New Haiku"

## Resilience

- If the primary AI provider is unavailable, the system falls back through multiple alternative providers automatically
- If image generation fails, fallback providers are tried in sequence
- If a shared haiku URL fails to decode, the user is redirected to the homepage to generate a fresh haiku
- If haiku generation fails entirely, the user sees an error message with a "Try Again" button

## Performance

- Haiku text loads first; the image streams in afterward
- Images and haiku responses are cached for 24 hours
- Background images fade in only after fully loaded (no partial rendering)

## SEO and Social

- Dynamic page titles: "Haiku: {topic}"
- Dynamic meta descriptions containing the haiku text
- Open Graph image set to the generated background
- Shareable URLs produce rich link previews on social platforms

## Non-Goals

- User accounts or authentication
- Saving or favoriting haikus (the URL is the bookmark)
- Haiku editing or customization
- Comments or social features
- Haiku history or feed
- Multiple languages (English only)
