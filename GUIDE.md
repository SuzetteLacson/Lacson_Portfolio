# Portfolio Website — Owner's Guide

Your project is 3 small files — the standard beginner-friendly structure:

| File | Job |
|---|---|
| `index.html` | The content — your text, images, sections |
| `style.css` | The design — colors, fonts, layout, animations, mobile view |
| `script.js` | The behavior — nav, carousels, project popups, scroll effects |
| `images/` | Your photos go here |

**Do I need CSS?** Yes — without `style.css` the page is plain black text on white. HTML is the skeleton, CSS is the appearance, JavaScript is the movement. Keeping them in separate files is exactly how you'd explain a clean project structure to a supervisor.

**What framework is this?** None — and that's on purpose. Plain HTML, CSS, and vanilla JavaScript: zero dependencies, nothing to install, instant load, deploys anywhere, and you can explain every line. See "Likely supervisor questions" below.

---

## 0. For your report — what this website is built with

- **Languages:** HTML5, CSS3, JavaScript (ES6) — nothing else
- **Frameworks / libraries:** none (vanilla stack, zero dependencies, on purpose)
- **Fonts:** JetBrains Mono + Inter, loaded from Google Fonts
- **Icons:** hand-inlined SVG (no icon library)
- **Layout:** CSS Flexbox (nav, hero, timeline, photo strip) + CSS Grid (project cards, skills)
- **Theming:** CSS custom properties (variables) — a 3-color palette (`#FFFFFF` / `#111111` / `#E8F24C`) defined once in `:root`
- **Animations:** pure CSS transitions & keyframes; JavaScript only toggles classes
- **Scroll effects:** `IntersectionObserver` API for both the scrollspy (active nav pill) and the scroll-reveal (fade/slide-in), a scroll progress line, and spring-physics anchor scrolling (the page "has weight")
- **Interactive parts (all vanilla JS):** ID badge on a lanyard with two-spring physics (swing + strap stretch, drag / flip-with-jolt), About "spotlight" (my photo centered with fact notes orbiting it — mouse parallax via CSS variables, self-drawing SVG arrows), 3D rotating photo ring with category tabs, drag-to-spin, keycap arrows, and an always-full circle (small tabs repeat their photos so there are never empty gaps), pressable skills keyboard with definitions, cursor-reactive dot-grid background (`<canvas>`), cursor-chasing diamond, project detail modal built from a data object, card mini-carousels, typewriter
- **Ambience (pure CSS):** falling tech objects on a fixed layer (code glyphs + mini keycaps + SVG icons: monitor, chip, bug, phone, cursor), unified "lifted sheet" section seams, self-pressing SCROLL keycap, custom SVG crosshair cursor
- **Responsive:** mobile-first friendly breakpoints at 880px / 680px / 500px
- **Accessibility:** semantic HTML5 tags, alt text, `aria-label`s, keyboard focus rings, `prefers-reduced-motion` support
- **Tools used:** VS Code + Live Server (development), Git & GitHub (version control), GitHub Pages (deployment)

---

## 1. Open & preview in VS Code

1. VS Code → **File → Open Folder** → this `Portfolio` folder.
2. If the bottom-left says **Restricted Mode**, click it → **Trust Folder**.
3. Install the **Live Server** extension (Ctrl+Shift+X → search "Live Server" → the one by Ritwick Dey → Install).
4. Open `index.html`, click **Go Live** (bottom-right). The page auto-refreshes every time you save.

## 2. Put in your real info

Ctrl+F in `index.html` or `script.js` and search **`EDIT-ME`** — the editable spots are marked.

**Your photos:**
1. Copy your pictures into the `images` folder (jpg or png).
2. In `index.html` (gallery) or `script.js` (projects), change the `src` / paths.
3. The `.svg` files currently there are just placeholders — delete them once your real photos are in.

**Add a gallery photo:** there's a ready-to-copy template in the big `EDIT-ME: HOW TO ADD A PHOTO` comment right above the gallery in `index.html`. Copy the `<figure class="ring-item">...</figure>` block, change the image, the `data-category` (which tab it belongs to: `events`, `arduino`, or `certs`), the `data-num` (the little number chip), and the caption. The circle re-spaces itself automatically — and if a tab has only a few photos, the ring repeats them to stay full, so there are never empty gaps. No JS editing needed. Portrait photos look best here.

**Add a gallery tab:** add a `<button class="gallery-tab" data-filter="yourname" aria-pressed="false">Your Name</button>` next to the others, then give some photos `data-category="yourname"`. The filtering picks it up automatically.

**Cert photos:** the two Certs entries are placeholders — photograph or scan your CCNA certificates, drop them in `images/`, and swap the `.svg` paths (marked EDIT-ME in the HTML).

**Edit a project (card + popup):**
1. Open `script.js` — the `projectPhotos` object is right at the top.
2. Each project has: `title`, `story` (the paragraphs), `tech`, `framework`, `languages`, `features`, `challenges`, `contribution`, and `photos`. Change any of them — the popup rebuilds itself.
3. The key like `mazebot:` must match the card's `onclick="openProject('mazebot')"` in `index.html`. When adding a new project, add both: a new entry in `projectPhotos` and a new card with the matching `onclick`.
4. Popup closes with the ✕ button, the Esc key, or clicking the dark background.

**Add a skill (keyboard key):** two steps — (1) in `index.html`, add `<button class="keycap" data-skill="yourskill">LABEL</button>` to a `kb-row` (use `class="keycap cap-lang"` for a yellow language key or `cap-tool` for a black tool key); (2) in `script.js`, add a matching `yourskill: { name, cat, text }` entry to the `skillDefs` object (marked EDIT-ME). The screen readout picks it up automatically.

**Edit the ID badge:** everything on the card is plain HTML in the hero section — the photo, name, role chip, and the facts on the back. The swing feel is tuned by `SPRING` and `DAMPING` in `script.js` §8.

**Add an experience:** copy a whole `<div class="t-item reveal">...</div>` block. Put the newest at the top. Add `current` to the classes (`t-item current reveal`) to give it the filled yellow dot.

**Add a school:** copy an `<article class="edu-card reveal">...</article>` block in the About section.

**Change the typewriter roles:** in `script.js`, edit the `phrases` array (marked EDIT-ME).

**Resume:** the footer button points to the PDF inside `images/` — replace that file to update it.

## 3. How each file works (explain-to-supervisor cheat sheet)

### index.html
Semantic HTML: `<nav>`, `<header>`, `<section>`, `<article>`, `<footer>` describe *meaning*, not just boxes — good for accessibility and SEO. Sections are numbered comments matching the page order. Elements with `class="reveal"` fade in when scrolled into view.

### style.css (12 numbered sections)
- **CSS variables** (`:root`) — the 3 colors and 2 fonts are defined once; `var(--yellow)` reuses them. Change one line to re-theme the whole site.
- **Flexbox** — navbar, hero, buttons, pills, timeline (things in a row or column).
- **CSS Grid** — project cards and skills: `repeat(auto-fill, minmax(290px, 1fr))` means "fit as many 290px-wide cards per row as possible" — responsive with zero media queries.
- **The 3D ring trick** — photo *i* gets `transform: rotateY(i × step) translateZ(radius)`, which stands the photos on an invisible circle. The parent has `transform-style: preserve-3d` (children keep 3D positions) and the scene has `perspective` (adds depth). JS then rotates ONE element — the ring — and every photo moves with it. The circle stays **gap-free** two ways: the radius is computed so neighbors sit ~12px apart, and tabs with few photos get their set repeated around the circle until it's full.
- **The spotlight trick (About)** — my photo is centered; each fact note is absolutely positioned around it. JS writes two numbers (`--mx`, `--my`) onto the container as CSS variables, and every note computes its own drift with `calc(var(--mx) × var(--depth) × -1px)` — one pair of numbers moves six notes by six different amounts (depth parallax). The arrows "draw themselves" with the SVG stroke-dash trick.
- **The ID flip trick** — front and back faces stacked with `backface-visibility: hidden`; the back starts at `rotateY(180deg)`. Rotating the wrapper 180° swaps which face you see.
- **The keycap trick** — the key's "depth" is `box-shadow: 0 6px 0` (a hard shadow straight down). Pressing moves the cap down 5px and shrinks the shadow to 1px, so it looks like it sinks into the board.
- **The mini-carousel trick** (project cards) — all photos sit in one long row (`display:flex`), the box has `overflow:hidden` so only one shows, and JS slides the row with `transform: translateX(-100%)` per step.
- **`object-fit: cover`** — crops photos to fill their box without stretching.
- **Media queries** — ≤880px collapses the nav into the ••• menu; ≤680px and ≤500px shrink photos, flatten the education zig-zag, and tune spacing.
- **`prefers-reduced-motion`** — all animations switch off for users who ask their OS for less motion. That's the accessibility answer if asked.

### script.js (8 numbered sections, fully commented)
- **`projectPhotos`** — one object holds every project's photos *and* write-up. The modal renders itself from this data (`buildWriteUp`), so adding a project never means writing new HTML.
- **Scrollspy** — an `IntersectionObserver` watches each section; when one crosses mid-screen, its nav link gets the yellow `.active` pill.
- **Scroll reveal** — a second `IntersectionObserver` adds `.visible` to `.reveal` elements the first time they appear; CSS does the actual fade/slide (the About portrait uses `clip-path` instead, for the wipe).
- **Gallery ring (§3)** — JS tracks one number, `ringAngle`. Arrows change it by one step, dragging changes it by pixels × 0.25, releasing snaps to the nearest step with `Math.round`. `applyFilter()` also enforces the **no-gaps rule**: it clones the tab's photos (in order) until the circle holds at least `MIN_SLOTS` (8), so 2 certs become A·B·A·B·A·B·A·B around a full circle. `pointerdown/move/up` events cover mouse AND touch in one API.
- **About spotlight parallax (§13)** — converts the cursor position into two −1…1 numbers, eases them with lerp, and hands them to CSS as custom properties. CSS does the actual moving. This "JS computes, CSS renders" split is the same pattern as the scroll-reveal.
- **ID lanyard (§8)** — a tiny physics simulation run by `requestAnimationFrame` (~60 calls per second). Each frame: `acceleration = -SPRING × angle - DAMPING × speed`, then speed and angle update. That one line is why the badge swings back and settles like a real hanging card. Dragging aims the badge at your pointer with `Math.atan2`; a click with < 8px of movement counts as a flip instead of a drag.
- **Skills keyboard (§9)** — one `skillDefs` object holds every definition; clicking a keycap looks up its `data-skill` and writes the text into the screen. Zero HTML changes needed to reword a definition.
- **Dot-grid background (§10)** — a full-screen `<canvas>`; a double loop stamps a dot every 26px, and dots within 130px of the cursor are drawn bigger and yellow (`Math.hypot` for distance). It only redraws when the mouse moves, throttled to once per frame.
- **Scroll progress line (§11)** — `width % = scrollY ÷ (page height − window height) × 100`. One formula, one style write.
- **Mini-carousels** — one variable `index` tracks the visible photo; the `%` remainder makes it loop; `setInterval` auto-plays every 4s.

**Key line to explain:** `item.style.transform = "rotateY(" + (i * ringStep) + "deg) translateZ(" + radius + "px)"` — rotate each photo around the circle's axis, then push it outward. That's the entire 3D gallery; JavaScript only ever spins one parent element.

## 4. Likely questions

- **"Why no framework like React?"** — A static portfolio doesn't need one. Plain HTML/CSS/JS = zero dependencies, instant load, deploys anywhere, and I can explain every line. For an app with dynamic data, I'd use React.
- **"Why 3 files?"** — Separation of concerns: content / presentation / behavior. Industry-standard structure at this scale.
- **"Is it responsive?"** — Yes: auto-wrapping grids, flexible layouts, and breakpoints at 880 / 680 / 500px. Demo it with F12 → device toolbar.
- **"How do the scroll animations work?"** — `IntersectionObserver` adds a class when an element enters the viewport; CSS transitions do the rest. No animation library.
- **"Is it accessible?"** — Semantic tags, alt text, aria-labels on icon buttons, visible keyboard focus rings, and `prefers-reduced-motion` support.
- **"How is it deployed?"** — GitHub Pages (below).

## 5. Deploy to GitHub Pages

1. Create a repo on GitHub (e.g. `portfolio`).
2. Upload the whole folder contents: `index.html`, `style.css`, `script.js`, and the `images` folder.
3. Repo → **Settings → Pages** → Source: `main` branch, root → Save.
4. Live at `https://yourusername.github.io/portfolio/` in a minute or two.

## 6. Quick tweak recipes

- **Change accent color:** edit `--yellow: #E8F24C;` at the top of `style.css`.
- **Justified paragraphs:** the "justified body text" rule in `style.css` section 2 lists every paragraph that's flush on both edges (education, bio, experience, projects, footer) — remove a selector from that list to make it left-aligned again; the `text-indent` rule below it controls the first-line indents.
- **Gallery auto-spin speed:** in `script.js` §3, change `5000` (milliseconds) in the auto-spin `setInterval`. Delete those lines to turn off auto-spin.
- **Gallery card size:** in `style.css`, `.ring-item { width / height }` (and the smaller sizes in the ≤680px media query). The circle's radius adapts automatically.
- **Badge swing feel:** in `script.js` §8 — raise `SPRING` for a snappier pull-back, raise `DAMPING` to calm the swing faster.
- **Background dot spacing / glow size:** in `script.js` §10, `GAP` and `GLOW`.
- **Gallery photo gaps / fullness:** in `script.js` §3 — `AIR` (12) is the px of air between neighboring photos, `MIN_SLOTS` (8) is how many photos the circle demands before it stops repeating the set.
- **Falling objects:** edit the `<span>`s inside `#floatLayer` in `index.html` (plain glyphs, `class="kf"` keycaps, `class="icon"` SVG icons); speed/lanes live in the `#floatLayer span:nth-child(...)` rules in `style.css`, and the sway/fade shape lives in the `floatFall` / `floatFallSway` keyframes.
- **Fact-note drift strength:** each `.orbit-pin.nX { --depth: ... }` in `style.css` — bigger number = that note drifts farther with the mouse.
- **Section seam look:** the `section, footer` rule in `style.css` section 2 — the first box-shadow is the yellow under-edge, the second is the soft lift blur.
- **Page scroll weight:** in `script.js` §2d, `42` is the spring pull and `11` the damping — lower damping = more overshoot bounce.
- **Badge physics feel:** in `script.js` §8 — `GRAVITY` (how hard it falls), `ROPE_GIVE` (strap elasticity: lower = stretchier), `AIR_DRAG` (how fast throws die out), `TILT_K`/`TILT_C` (dangle wobble).
- **Section slide distance/speed:** `style.css` section 11 — `translateY(56px)` and `0.85s` in the `section > .wrap` rule.
- **Click sparks:** count (`8`), speed, and gravity (`900`) live in the sparks block of `script.js` §10.
- **Cursor diamond:** size/colors in the `#cursorTrail` CSS rule; chase speed is the `0.14` lerp factor in `script.js` §12.
- **Reveal animation speed:** in `style.css` section 11, change `0.6s` in the `.reveal` rule.
- **Stronger card tilt:** `.project:hover` → change `-1deg` to `-2deg`.
- **Reorder sections:** cut/paste an entire `<section>` block in `index.html`, and reorder the nav links (both the desktop `.nav-links` list and the mobile dropdown) to match.
