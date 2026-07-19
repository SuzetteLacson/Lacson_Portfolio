# What's New — July 19 Update (Presentation Notes)

This file explains everything that changed in this update, in the order you'd
demo it. Each part has: **what changed → how it works → what to say when
presenting**. Read it once and you can walk a supervisor through the whole
update without opening this file again.

---

## 0. The tech stack (unchanged — say this first)

- **Languages:** HTML5, CSS3, JavaScript (ES6). Nothing else.
- **Frameworks / libraries:** **none** — still zero dependencies, on purpose.
  Every effect in this update (parallax, self-drawing arrows, the filmstrip,
  the falling objects) is hand-written vanilla code I can explain line by line.
- **Browser APIs used:** `IntersectionObserver` (scroll reveals), Pointer
  Events (drag on mouse *and* touch), `requestAnimationFrame` (smooth motion),
  CSS Custom Properties (the JS→CSS data bridge — new this update).

---

## 1. About section — the "spotlight" redesign

**What changed:** the old About had my photo on the left and a fake terminal
with a `profile.json` tab on the right. Now my photo sits **center stage** and
the six facts that used to be JSON text float **around** me on sticky-note
cards, each with a hand-drawn-style arrow pointing back at the photo — like a
creator-intro video frame, but interactive. The bio kept its terminal
(`bio.md` tab) below. Everything in About now shares one left edge — the
intro, the terminal, and the education cards line up flush (the education
track used to be indented 34px to the right).

**How it works (4 layers of motion):**

1. **Wipe-in photo** — the portrait is hidden by
   `clip-path: inset(0 100% 0 0)` (clipped 100% from the right). When you
   scroll to it, the scroll observer adds `.visible` and the clip animates
   to `inset(0)` — a wipe, GPU-cheap, no layout reflow.
2. **Staggered pop-in** — each note starts at `opacity: 0; scale(0.7)`.
   The `.visible` state transitions them in, and each note has its own
   `transition-delay` (0.30s, 0.42s, 0.54s…) so they appear one at a time.
3. **Self-drawing arrows** — each arrow is a small inline SVG. The curve has
   `stroke-dasharray: 90; stroke-dashoffset: 90` (one dash as long as the
   whole path, pushed fully out of view = invisible line). Transitioning the
   offset to `0` makes the stroke "draw itself". The arrowhead fades in
   right after its line finishes.
4. **Mouse parallax** (`script.js` §13) — **this is the data-transfer part
   worth presenting.** JavaScript never touches the notes. It converts the
   cursor position into two numbers between −1 and 1, smooths them with lerp
   (`current += (target − current) × 0.08` per frame), and writes them onto
   the *container* as CSS variables:

   ```js
   spotlightEl.style.setProperty("--mx", curMX.toFixed(4));
   spotlightEl.style.setProperty("--my", curMY.toFixed(4));
   ```

   Over in `style.css`, every note-holder computes its own drift:

   ```css
   transform: translate(
     calc(var(--mx, 0) * var(--depth, 10) * -1px),
     calc(var(--my, 0) * var(--depth, 10) * -1px)
   );
   ```

   Each note declares a different `--depth` (9–18), so ONE pair of numbers
   moves SIX notes by six different amounts — the depth difference is what
   reads as 3D. **CSS variables are acting as the data bridge between
   JavaScript and CSS.**

**Small engineering detail worth mentioning:** each note is split into two
elements — an invisible `.orbit-pin` (position + parallax transform) holding
the visible `.orbit-note` (reveal + hover transform). If one element did both,
the two effects would overwrite each other's `transform`. Separating the jobs
onto parent and child lets both run at once. Hovering a note also lifts it
with the site's signature yellow hard-shadow and highlights its arrow.

**Responsive:** below 880px the absolute positions would collide, so the
spotlight flattens into a CSS grid — photo on top, notes in two columns
(one column below 500px), arrows and parallax switched off.

**The bio terminal below the spotlight** was centered (`margin: 0 auto`,
same 760px width as the education cards) and restyled to live fully inside
the site's 3-color palette: pure-black window, header dots in
yellow / white / outline (no more off-palette mac red-green), a mono
`suzette@dev-machine:~$ cat bio.md` prompt line "printing" the bio, and the
site's signature double shadow (yellow slab + thin black outline — the same
recipe as the spotlight photo, so the two blocks visually rhyme).

**The education track** was polished to match: centered at the same 760px,
its timeline rail is clearly visible again (it runs in the left margin just
outside the cards, with a yellow dot pinned per school), each card got a
soft resting shadow, and a big faint `01 / 02 / 03` watermark counts the
schools in each card's corner — done with a pure-CSS counter
(`counter-reset` / `counter-increment`), zero extra HTML.

**What to say:** *"I redesigned my About section into an interactive profile
card: my facts orbit my photo with staggered reveal animations, SVG arrows
that draw themselves in, and cursor parallax where JavaScript feeds two CSS
variables and the stylesheet computes each note's drift with calc()."*

---

## 2. Gallery — same 3D ring, but the circle is now ALWAYS full

**What changed:** the 3D rotating ring stays (that's the style I wanted to
keep) — the fix is that it can no longer show empty holes. Before, a tab
with only 2 photos (Certs) put two lonely cards on a big circle with huge
gaps between them. Now the ring **fills itself**.

**How it works — the two-part "no-gaps rule":**

1. **Repeat the set.** When a tab is chosen, `applyFilter()` checks how many
   photos it has. If fewer than `MIN_SLOTS` (8), it **clones** the whole set
   in order (`cloneNode(true)`, marked `.ring-clone`) until the circle holds
   at least 8: 2 certs become `A·B·A·B·A·B·A·B`, 4 event photos become
   `A·B·C·D·A·B·C·D`. Switching tabs throws the old clones away and builds
   new ones. Adding real photos in the HTML needs zero JS edits.
2. **Seat neighbors almost touching.** The circle's radius comes from
   geometry: neighboring photos sit one chord apart, and
   `chord = 2 × radius × sin(180° / count)`, so
   `radius = (photoWidth + AIR) / (2 × sin(180° / count))` with `AIR = 12`
   puts exactly ~12px of air between every pair of neighbors. Verified in
   the browser: radius 355.4px on desktop → measured gap = 12px.

- The ring still auto-spins every 5s (pausing on hover), drags with mouse or
  touch (Pointer Events), and snaps to the nearest photo on release.
- The ‹ › arrows kept their **keycap** styling and float right at the ring's
  edges, close to the photos — press one and it sinks into its shadow like a
  real key.
- Robustness: the layout re-measures on window `resize` *and* once on full
  page `load`, so a late scrollbar can't leave the circle mis-sized.

**What to say:** *"The gallery keeps its 3D carousel, but I made the circle
self-filling: the chosen tab's photos are cloned in order until the ring
holds at least eight, and the radius is computed from circle geometry —
chord = 2r·sin(π/n) — so neighbors always sit twelve pixels apart. Empty
gaps are now mathematically impossible, for any photo count."*

---

## 3. Falling background — themed tech objects on every section

**What changed:** the falling layer used to be code glyphs only, and it
disappeared behind the yellow Gallery/Skills sections. Now it also rains:

- **mini keyboard keycaps** — styled exactly like the Skills keys (border +
  hard shadow), including a **Q and an A cap… because QA** ✦
- **five tiny SVG icons** that match my actual profile: a **monitor**, a
  **microchip** (Arduino/hardware), a **bug** (QA!), a **phone** (app dev),
  and a **mouse cursor** — two of them with yellow-filled bodies so the
  brand color falls too

…and it now **stays visible through every section**, yellow ones included.

**How it works:**

- Still **100% CSS, zero JavaScript**, and the fall itself is no longer a
  straight drop: each object **sways side to side and wobbles** as it falls
  (like paper through air), **fades in** just below the top edge and
  **fades out** before the bottom — no more popping in and out of
  existence. Odd-numbered fallers sway right first, even-numbered left
  first (`floatFall` vs its mirrored twin `floatFallSway`), so the layer
  never marches in step. Each faller type peaks at its own opacity through
  a `--fo` custom property (glyphs 100% of their faint color, keycaps 32%,
  icons 30%) — one pair of keyframes serves every faller.
- Only `transform` and `opacity` animate (GPU-composited, never triggers
  layout), and each faller gets its own lane/speed/head-start from
  `nth-child` rules with **negative animation-delays** (each one starts
  mid-fall, so the screen is never empty).
- The cross-section visibility is a **stacking-context fix**: the layer moved
  from `z-index: -1` (under the opaque yellow backgrounds) to `z-index: 0`,
  and every content container (`.wrap`) got `position: relative; z-index: 1`.
  Result: *section background → falling objects → content*, in that order,
  everywhere on the site. Text never gets covered because content always
  stacks above the layer.

**What to say:** *"The ambient layer is pure CSS animation on a fixed layer —
only transform animates, so it's GPU-composited and costs no JavaScript. To
make it persist over colored sections I restructured the z-index stack into
three layers: backgrounds at auto, the ambient layer at 0, content at 1."*

---

## 4. Bug fix — the disappearing arrow in SUZENTINEL (slide 2)

**The bug you found:** after adding the 5 SUZENTINEL screenshots, the `›`
arrow vanished on the 2nd slide.

**Root cause (a genuinely good story for a QA presentation):** the modal's
photo row is a flex container: `‹ button | image | › button`. Flex items
have a default of `min-width: auto`, which means *"never shrink me below my
content's natural size"* — and for an `<img>`, the natural size is the file's
**real pixel width**. Slide 2 is `WORKINGSTAT.png`, which is **1592px wide** —
wider than the whole modal. The image refused to shrink, the row overflowed,
and the `›` button was pushed outside the visible box. Slide 1 (860px) fit,
which is why only some slides broke — the bug depended on the *data*, not
the code path. Classic.

**The fix (2 lines in `style.css`, `#modal-img`):**

```css
min-width: 0;          /* tells flexbox: you MAY shrink this image */
object-fit: contain;   /* wide dashboards show WHOLE, not cropped */
```

`min-width: 0` restores flexbox's permission to shrink the image, so the
buttons always keep their space. Switching `cover` → `contain` was a bonus:
dashboard screenshots now display complete instead of being cropped to fill
— which matters when the screenshot's content *is* the point.

**What to say:** *"The arrow disappeared only on slide 2 because that
specific file was 1592px wide — flexbox's min-width:auto default let the
image's intrinsic size overflow the row and push the button out. min-width: 0
fixes it for any image size. It's a data-dependent layout bug: same code,
different input, different result — which is exactly why we test with real
data."*

---

## 5. Alignment fix — About vs Education

**The complaint:** the education cards sat 34px further right than the rest
of About (the old timeline reserved a left gutter for its spine line).

**The fix:** the gutter is gone — the cards now start flush at the section's
left edge, same line as the spotlight and the terminal (verified: all left
edges land on the exact same pixel). The spine didn't disappear: it now runs
along the cards' own left border, hiding behind each card and showing only in
the gaps *between* them — it stitches the timeline together — and each card's
yellow dot is pinned onto its left edge (`left: -9px`), centered on that line.
The terminal and education track also share the same `max-width: 760px`, so
the whole About column reads as one aligned block.

---

## 6. Where everything lives (for questions)

| Change | HTML | CSS | JS |
|---|---|---|---|
| About spotlight | `index.html` → `#aboutSpotlight` | `style.css` §5 (spotlight/orbit/arrow rules) | `script.js` §13 (parallax) |
| Bio terminal (centered, on-palette) | `index.html` → `.terminal` (dots + prompt line) | `style.css` §5 (terminal rules) | — |
| Gallery ring (always-full circle) | `index.html` → `#gallery` (+ EDIT-ME template) | `style.css` §6 | `script.js` §3 (clone-fill + radius) |
| Falling objects (sway + fade) | `index.html` → `#floatLayer` | `style.css` §2 (fallers, keyframes, z-index stack) | none — pure CSS |
| Modal arrow fix | — | `style.css` → `#modal-img` | — |
| Edu track (centered, rail, watermarks) | — | `style.css` → `.edu-track` / `.edu-card` | — |

Every new block of code carries teaching-style comments explaining *why*,
not just *what* — the main files are their own annotated copies. (The
`annotated/` folder still describes the previous version of the site;
`GUIDE.md`, `LEARNING.md`, and `PROJECT-STATE.md` are all updated to match
this redesign.)

## 7. Rapid-fire Q&A prep

- **"Did you use a library for the parallax/carousel?"** — No. The parallax
  is ~30 lines (pointer math + lerp + two CSS variable writes); the carousel
  is one state number rendered with translateX. That's the point of the
  vanilla stack: I can defend every line.
- **"How does the site respect accessibility?"** — All new motion sits behind
  the existing `prefers-reduced-motion` block (spotlight appears assembled,
  strip doesn't auto-slide, fallers stop); arrows/buttons keep `aria-label`s;
  the drag carousel is fully operable by buttons alone.
- **"What was the hardest part?"** — Making three transforms coexist on the
  About notes (reveal scale, hover lift, parallax drift). Solved by splitting
  responsibilities across a parent/child pair so no transform overwrites
  another.
- **"What did you learn from the arrow bug?"** — Flexbox `min-width: auto`
  on replaced elements, and that layout bugs can be data-dependent: the code
  was "correct" until a 1592px-wide input arrived.
