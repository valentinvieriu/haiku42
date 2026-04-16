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
- Tone is reflective and evocative — modern sensibility with poetic restraint
- The LLM never receives an abstract topic ("loneliness", "technology"). It receives a **scene seed** — a role-labeled, semicolon-separated string of 2–5 concrete, imageable clauses describing a micro-moment. The LLM inhabits the scene and writes the haiku from inside it.
- The same seed feeds both the haiku and the image generation, so poem and image share a single world.

#### Why scene seeds, not topics

Abstract topics produce topic sentences. Concrete sensory clauses force the poem into a specific place, time, and body. Meaning emerges from juxtaposition of concrete elements rather than from explanatory verbs ("reveals", "teaches", "versus") or abstract nouns ("climate grief", "digital anxiety").

**Imageability rule:** every visible element must be specific enough for both a language model and an image model to picture it — including absences ("empty hook on the wall", not "the motivation that was there this morning").

#### Modes (families of moments)

Seeds are drawn from one of 8 modes, chosen by weighted random selection. Mode selection itself provides thematic steering without naming the theme.

| Mode | Weight | Character |
| --- | --- | --- |
| observation | 30 | outdoor stillness, nature watched closely |
| urban-nature | 20 | city edges where nature persists |
| human-trace | 20 | evidence someone was here (institutional, service, civic spaces) |
| domestic-turn | 15 | interior moments in home and intimate spaces |
| climate-echo | 10 | climate-adjacent imagery without preaching |
| transit | 10 | moving between places |
| night-and-silence | 10 | after-hours, dark, quiet |
| comic-glimpse | 5 | small absurdities |

#### Scene clusters (coherence within a mode)

Modes whose moments span very different physical spaces (**human-trace**, **domestic-turn**, **transit**, **night-and-silence**) are split into sub-clusters. Every entry in a cluster is plausible in the same physical space (e.g. "institutional interiors" vs. "backyard porches"). Composition first picks a cluster, then draws within it — so a single seed never mixes a hospital hallway with a ski lodge.

#### Pools (organized by poetic function, not subject)

Each mode/cluster exposes entries in pools defined by what the element does in the poem:

- **frames** — where and when (`bus stop at dusk`, `hospital hallway at shift change`)
- **anchors** — focal subject + action, what the eye lands on (`crow landing on a wire`, `janitor mopping around the sleeping man`)
- **sensory** — sound, smell, touch, light (`wet earth smell after thunder`, `the fluorescent hum`)
- **traces** — human residue, evidence someone was here (`cigarette butt in the flower planter`)
- **absences** — what's NOT there, negative space / *ma* (`empty hook on the wall`, `stoplight cycling with no cars`)
- **turns** — a small shift or reveal (present on some modes; falls back to traces/sensory/anchors when absent)

#### Composition templates

Once a mode's pools are resolved, one of 7 composition templates is chosen by weighted random to assemble the seed. Templates define both the number of parts and which pools they come from. Most seeds are 3 elements — grounded but not overloaded.

| Template | Weight | Shape |
| --- | --- | --- |
| anchored | 28 | Setting + Focus + Sense |
| turned | 24 | Setting + Focus + Turn |
| juxtaposed | 15 | Setting + Focus + Trace |
| absence-led | 15 | Setting + Absence + Turn |
| layered | 10 | Setting + Sense + Absence |
| pivot | 5 | Setting + Turn *(2 parts)* |
| minimal | 3 | Setting + Focus *(2 parts)* |

#### Temporal modifier

25% of seeds prepend a time-phrase to the setting ("past midnight — park bench after rain", "just before closing — pharmacy counter"). This turns a static frame into a moment in progress.

#### Output format

Role-labeled clauses joined by `"; "`. Example:

```
Setting: rest stop off the highway; Focus: crow landing on a wire; Sense: wet earth smell after thunder
```

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
