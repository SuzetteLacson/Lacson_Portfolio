# Learning Guide — Every Concept In This Portfolio

Study companion for the site. Each topic: what it is, why it matters, where it lives in this project, and how to reuse it.

---

## 1. HTML Concepts

### Semantic structure
- **What:** `<nav>`, `<header>`, `<section>`, `<article>`, `<figure>`, `<footer>` describe *meaning*, not just boxes.
- **Why:** screen readers, SEO, and future-you all understand the page faster.
- **Where:** the whole of `index.html`.
- **Reuse:** always reach for a semantic tag before a `<div>`.

### `data-*` attributes (custom data on elements)
- **What:** `data-category="arduino"`, `data-skill="python"`, `data-num="001"` — your own named values attached to HTML, read in JS as `el.dataset.category`, and even in CSS as `content: attr(data-num)`.
- **Why:** they let one generic JS function serve many elements — the gallery tabs and skill keys have **zero** per-item JavaScript.
- **Where:** gallery `ring-item`s, `gallery-tab`s, `keycap`s.
- **Reuse:** any time you're tempted to write `if (id === "thing1") ... if (id === "thing2")`, use a data attribute instead.

### Inline SVG + data-URI images
- **What:** icons pasted directly into HTML (`<svg>...</svg>`) and the cursor drawn as an SVG inside a CSS `url("data:image/svg+xml,...")`.
- **Why:** zero network requests, styleable with `currentColor`, no icon library.
- **Where:** footer contact icons; the crosshair cursor in `style.css`.

---

## 2. CSS Concepts

### Custom properties (variables)
- **What:** `--yellow: #E8F24C` in `:root`, used as `var(--yellow)` everywhere.
- **Why:** change one line → the whole site re-themes. This is also how design systems work in industry.
- **Where:** `style.css` section 1; used ~100 times.

### Flexbox vs Grid
- **Flexbox** = one row or column that distributes space (nav, hero copy, timeline, keyboard rows).
- **Grid** = two-dimensional layout (project cards, About intro `320px 1fr`).
- **Rule of thumb:** content in a line → flex; a layout with rows *and* columns → grid.

### 3D transforms (the gallery ring & badge flip)
- **What:** `perspective` (camera depth) on the parent, `transform-style: preserve-3d` (children keep 3D positions), `rotateY() translateZ()` (rotate around vertical axis, push outward), `backface-visibility: hidden` (hide a card's reverse).
- **Where:** `.ring-scene` / `.ring` / `.ring-item`, and `.id-badge` / `.badge-inner` / `.badge-face`.
- **Key insight:** the ring's photos never move individually — JS rotates ONE parent and geometry does the rest.

### clip-path reveals
- **What:** `clip-path: inset(0 100% 0 0)` hides an element by clipping 100% from the right; animating to `inset(0)` "wipes" it open.
- **Where:** the ME2 portrait in About.
- **Why not width/height animation:** clip-path doesn't reflow the page — it's GPU-cheap.

### The hard-offset shadow language (theme signature)
- **What:** `box-shadow: 8px 8px 0 var(--yellow)` — a solid, non-blurred shadow. Also powers keycap depth (`0 6px 0`) and the **section seams** (`0 -8px 0 -3px var(--yellow)` = a yellow edge peeking above each section's black top border, plus a soft blur for lift).
- **Why:** one consistent visual signature = the site feels designed, not assembled.

### Pseudo-elements as free extra boxes
- **What:** `::before` / `::after` add decorations without HTML: number chips (`content: attr(data-num)`), the h2 yellow accent bar, timeline dots, the screen's blinking `▌`.
- **Reuse:** decorations that repeat → pseudo-element + attribute, never copy-pasted HTML.

### CSS-only ambient animation
- **What:** the falling code glyphs — `@keyframes floatFall` animating only `transform`, with per-glyph `nth-child` lanes/speeds and **negative `animation-delay`** (starts each glyph mid-fall so the screen is never empty).
- **Performance:** transform + opacity are the two properties browsers animate on the GPU without re-layout. Everything ambient here sticks to them.

### Media queries & `prefers-reduced-motion`
- Breakpoints: 880px (nav collapses, hero stacks), 680px (ring shrinks, grids stack), 500px (fine-tuning).
- `@media (prefers-reduced-motion: reduce)` switches off *every* animation — swing, ring, glyphs, cursor. That's a real accessibility requirement, not decoration.

---

## 3. JavaScript Concepts

### The one data-object pattern
- **What:** `projectPhotos` and `skillDefs` hold ALL content; functions render from them (`buildWriteUp`).
- **Why:** editing content never touches logic. This is the core idea behind React props — you're doing it by hand.

### IntersectionObserver
- **What:** the browser tells you when an element enters the viewport (no scroll-event math).
- **Where:** scrollspy (nav pill), scroll-reveal (`.reveal → .visible`), section h2 lifts.
- **Why it beats scroll listeners:** it runs off the main thread and doesn't fire 60×/second.

### Pointer Events (mouse + touch, one API)
- **What:** `pointerdown/move/up/cancel` + `setPointerCapture` (keeps receiving moves even when the pointer leaves the element).
- **Where:** dragging the ring, dragging the badge.
- **Click vs drag:** measure the pointer's travel; < 8px = it was a tap (that's how the badge knows to flip, not swing).

### requestAnimationFrame physics
The badge is a **two-spring simulation**, run every frame (~60fps):
```
acceleration = -SPRING × displacement - DAMPING × velocity
velocity    += acceleration × dt
displacement += velocity × dt
```
- Spring 1 rotates the arm (swing). Spring 2 stretches the strap (bounce). The flip adds an impulse (`speed += ...`) so the card jolts like a real object.
- The **same formula** drives the spring page-scroll (§2d) — `displacement` is just the scroll position there. Damping slightly under critical = tiny overshoot = "weight".
- `dt` (delta time) is measured from the timestamps so speed is identical on 60Hz and 144Hz screens. That's how game engines work too.

### Lerp (linear interpolation)
- **What:** `x += (target - x) * 0.14` — move 14% of the remaining distance each frame.
- **Where:** the cursor diamond chase.
- **Why:** three lines of code produce buttery smoothing; the factor is the "lag" dial.

### Canvas 2D
- **What:** `getContext("2d")`, then draw with `fillRect` / `arc`. The dot grid is a double loop; `Math.hypot(dx, dy)` measures the cursor distance for the yellow glow.
- **Perf pattern:** only redraw when the mouse actually moves, at most once per frame (`redrawQueued` flag + rAF).

### Feature-guarding
- Every module starts `if (element exists)` — so deleting a section of HTML never crashes the script.
- Capability checks: `matchMedia("(pointer: fine)")` (no cursor toy on phones), `prefers-reduced-motion`, `"IntersectionObserver" in window`.

---

## 4. Animation Principles Used
1. **Motion needs mass** — springs and damping instead of fixed-duration tweens (badge, page scroll).
2. **Stagger, don't dump** — education cards and project cards cascade via `transition-delay`.
3. **One strong signature** — hard-offset shadows move (lift/press) consistently on every hover.
4. **Ambient ≠ loud** — glyphs at 9% opacity, dot glow only near the cursor.
5. **Respect the user** — reduced-motion kills everything; a wheel/touch cancels the spring scroll instantly.

## 5. Accessibility Checklist Implemented
- Semantic landmarks, alt text, `aria-label` on icon-only buttons, `aria-pressed` on tabs
- Badge: `role="button"` + `tabindex="0"` + Enter/Space flips it
- `:focus-visible` outlines (black on light, yellow on dark)
- `aria-live="polite"` on the skills screen so screen readers hear the definition
- Native cursor kept for links/buttons; the diamond is decoration, not a replacement
- `prefers-reduced-motion` support throughout

## 6. Performance Checklist Implemented
- Animations use **transform/opacity only** (GPU-composited, no reflow)
- `will-change: transform` on the three perpetually-moving pieces
- rAF-throttled canvas redraw; passive scroll listeners; `IntersectionObserver` over scroll math
- `loading="lazy"` on below-fold images; observers `unobserve` after reveal
- Zero libraries: total JS is one small file, no framework runtime
