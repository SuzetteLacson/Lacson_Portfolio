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
- **Scroll effects:** `IntersectionObserver` API for both the scrollspy (active nav pill) and the scroll-reveal (fade/slide-in)
- **Interactive parts (all vanilla JS):** gallery tabs + expanding photo strip, project detail modal built from a data object, card mini-carousels, terminal tabs, typewriter
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

**Add a gallery photo:** copy one whole `<figure class="strip-item">...</figure>` block, paste it in, then change the image, the `data-category` (which tab it belongs to: `events`, `arduino`, or `certs`), the `data-num` (the little number chip), the `data-label` (the vertical spine text), and the caption. The strip adjusts automatically — no JS editing needed. Portrait photos look best here.

**Add a gallery tab:** add a `<button class="gallery-tab" data-filter="yourname" aria-pressed="false">Your Name</button>` next to the others, then give some photos `data-category="yourname"`. The filtering picks it up automatically.

**Cert photos:** the two Certs entries are placeholders — photograph or scan your CCNA certificates, drop them in `images/`, and swap the `.svg` paths (marked EDIT-ME in the HTML).

**Edit a project (card + popup):**
1. Open `script.js` — the `projectPhotos` object is right at the top.
2. Each project has: `title`, `story` (the paragraphs), `tech`, `framework`, `languages`, `features`, `challenges`, `contribution`, and `photos`. Change any of them — the popup rebuilds itself.
3. The key like `mazebot:` must match the card's `onclick="openProject('mazebot')"` in `index.html`. When adding a new project, add both: a new entry in `projectPhotos` and a new card with the matching `onclick`.
4. Popup closes with the ✕ button, the Esc key, or clicking the dark background.

**Add a skill:** find the right category in the Skills section and add `<span class="pill">Name</span>` (use `class="pill hl"` to highlight, like the CCNA one).

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
- **The gallery strip trick** — all photos share one flex row; the expanded one has `flex: 3.5`, the rest `flex: 1`, and `transition: flex` animates the change. The vertical labels are just `writing-mode: vertical-rl` on a pseudo-element.
- **The mini-carousel trick** (project cards) — all photos sit in one long row (`display:flex`), the box has `overflow:hidden` so only one shows, and JS slides the row with `transform: translateX(-100%)` per step.
- **`object-fit: cover`** — crops photos to fill their box without stretching.
- **Media queries** — ≤880px collapses the nav into the ••• menu; ≤680px and ≤500px shrink photos, flatten the education zig-zag, and tune spacing.
- **`prefers-reduced-motion`** — all animations switch off for users who ask their OS for less motion. That's the accessibility answer if asked.

### script.js (8 numbered sections, fully commented)
- **`projectPhotos`** — one object holds every project's photos *and* write-up. The modal renders itself from this data (`buildWriteUp`), so adding a project never means writing new HTML.
- **Scrollspy** — an `IntersectionObserver` watches each section; when one crosses mid-screen, its nav link gets the yellow `.active` pill.
- **Scroll reveal** — a second `IntersectionObserver` adds `.visible` to `.reveal` elements the first time they appear; CSS does the actual fade/slide.
- **Gallery strip** — JS only moves the `.active` class between photos (hover / tap / focus / auto-cycle every 4.5s); the expanding animation is 100% CSS (`transition: flex`).
- **Mini-carousels** — one variable `index` tracks the visible photo; the `%` remainder makes it loop; `setInterval` auto-plays every 4s.

**Key line to explain:** `miniTrack.style.transform = "translateX(-" + index * 100 + "%)"` — photo 0 = 0%, photo 1 = −100%, photo 2 = −200%. That's the whole carousel.

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
- **Gallery cycle speed:** in `script.js`, change `4500` (milliseconds) in the photo strip `setInterval`. Delete those lines to turn off auto-cycling.
- **Taller gallery:** in `style.css`, `.photo-strip { height: 560px; }`.
- **Wider expanded photo:** in `style.css`, `.strip-item.active { flex: 3.5; }` — bigger number = wider.
- **Reveal animation speed:** in `style.css` section 11, change `0.6s` in the `.reveal` rule.
- **Stronger card tilt:** `.project:hover` → change `-1deg` to `-2deg`.
- **Reorder sections:** cut/paste an entire `<section>` block in `index.html`, and reorder the nav links (both the desktop `.nav-links` list and the mobile dropdown) to match.
