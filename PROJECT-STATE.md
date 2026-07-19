# PROJECT-STATE — Suzette Lacson Portfolio (Knowledge Transfer)

> Paste this file into any AI conversation to give it full context of the project
> without re-analyzing the code. Last updated: 2026-07-19.

## 1. Identity & Purpose
- Personal portfolio of **Suzette B. Lacson** — Computer Engineering student (University of Batangas–Lipa), QA Automation intern at Pick.A.Roo (AGILE Digital Ventures), based in Lipa City, PH.
- Target roles: **QA automation / software testing**; interests: **Arduino & embedded hardware**, learning **mobile app development**. ⚠️ NEVER describe her as full-stack or pure frontend — she explicitly rejected that.
- Voice: professional but human, student-built, lightly playful. No AI-sounding or corporate copy.
- Deployment target: GitHub Pages. Dev workflow: VS Code + Live Server (port 5500).

## 2. Hard Constraints (do not violate)
- **Palette (locked):** `--yellow:#E8F24C`, `--black:#111111`, `--white:#FFFFFF` — nothing else.
- **Fonts (locked):** JetBrains Mono (headings/mono UI) + Inter (body), via Google Fonts.
- **Zero frameworks/libraries** — vanilla HTML5/CSS3/ES6 only, on purpose (student must be able to explain every line; a written brief requires this).
- Improve, never rewrite; preserve comments and `EDIT-ME` markers; keep code beginner-explainable.
- All facts must stay truthful to her CV. All motion must respect `prefers-reduced-motion`.

## 3. Folder Structure
```
Portfolio 2/
├── index.html        # all content/markup, sections numbered 01-05
├── style.css         # 12 numbered sections (tokens→mobile), heavily commented
├── script.js         # 12 numbered modules, heavily commented
├── GUIDE.md          # owner's manual: edit recipes, supervisor Q&A, report list
├── LEARNING.md       # study guide: every concept explained for the owner
├── PROJECT-STATE.md  # this file
├── images/           # photos + CV PDF + placeholder .svg files
└── annotated/        # line-by-line teaching copies (STALE — describe old code)
```

## 4. Page Architecture (top to bottom)
| Section | id | Key components |
|---|---|---|
| Fixed layers | — | `#scrollProgress` (top progress line), `#bgGrid` (canvas dot grid, z:-1), `#floatLayer` (CSS falling tech objects — glyphs + `.kf` mini keycaps + `.icon` SVGs [monitor/chip/bug/phone/cursor]; **z:0, above section bgs incl. yellow, below `.wrap` content at z:1**; fall = `floatFall`/`floatFallSway` keyframes: side-to-side sway + rotation wobble, odd/even children mirror each other, fade in at top / out at bottom peaking at per-type `--fo` opacity), `#cursorTrail` (chasing diamond) |
| Nav | — | `.nav-dock` black capsule: inline links ≥880px w/ scrollspy yellow pill; `•••` dropdown below |
| Hero | `#top` | `.hero-grid`: name/typewriter/tagline left + **ID lanyard** right (`#lanyardArm` swings, `#idBadge` drag/flip, front=photo+name, back=facts). `.scroll-key` self-pressing keycap links to About |
| 01 About | `#about` | **`.about-spotlight`**: ME2.png centered (clip-path wipe + `photoFloat` idle bob) with six `.orbit-pin > .orbit-note` fact cards around it — staggered pop-in, self-drawing SVG arrows (stroke-dash), mouse parallax via `--mx/--my/--depth` CSS vars (§13); ≤880px flattens to a grid, arrows off. Then the terminal (single tab: bio.md; **CENTERED**, `margin: 0 auto` + max-width 760px; restyled fully on-palette: pure-black window, yellow/white/outline header dots, `$ cat bio.md` prompt line, double shadow yellow+black outline). Then `.edu-track` timeline (UB CpE ← LPU Nursing 21-23 ← Nazareth STEM 18-21): **CENTERED** at 760px like the terminal, visible spine rail in the left margin (`::before` at -16px, dots at -24px), cards have resting shadows + big faint 01/02/03 CSS-counter watermarks (`counter-reset: school`) |
| 02 Gallery | `#gallery` (yellow) | `.gallery-tab`s (events/arduino/certs) filter a **3D ring** (`#photoRing`, rotateY/translateZ); drag-to-spin, keycap ‹ › arrows floating AT the ring edges, auto-spin 5s; **no-gaps rule:** `applyFilter()` clones the tab's photos until ≥ MIN_SLOTS (8) — 2 certs → A·B×4 — and `ringRadius()` = `(itemW+AIR)/(2·sin(π/count))` seats neighbors ~12px apart (AIR=12); re-layout on resize AND window load. EDIT-ME photo template in a comment above the markup. Cert photos = placeholders awaiting real scans |
| 03 Projects | `#projects` | 3 cards (SUZENTINEL / mazebot / amari) w/ mini-carousels → modal renders blog-style STAR write-up from `projectPhotos` object |
| 04 Skills | `#skills` (yellow) | keycap keyboard; press → definition on LCD `.skill-screen`; colors: yellow=languages, white=QA/auto, black=tools, wide black/yellow=CCNA cert |
| 05 Experience | `#experience` | dot-spine timeline, newest first: Pick.A.Roo intern (current, pulsing dot) → Amari coordinator → KIA sales → Brahman school org |
| Contact | `#contact` (footer) | resume download (PDF in images/), email, GitHub (SuzetteLacson), LinkedIn (suzettelacson); inline SVG icons |

## 5. script.js Modules (numbered)
1. `projectPhotos` — data: title, story[], tech, framework, languages, features[], challenges, contribution, photos[] per project
2. Nav: dropdown, scrollspy (IO, rootMargin -40%/-55%, bottom-of-page forces Contact), scroll-reveal (IO 0.15 + auto-adds `.reveal` to section h2s), **§2c-bis section slides** (IO adds `.section-in` → whole `.wrap` glides up 56px, once per section), **§2d spring scroll** (k=42, c=11, wheel/touch cancels)
3. Gallery 3D ring: one state number `ringAngle`; clone-fill to MIN_SLOTS=8 (`.ring-clone` nodes, removed on refilter), snug radius w/ AIR=12, drag 0.25°/px + snap to step, auto-spin 5s, layoutRing on resize + load
4. Modal engine (`openProject/buildWriteUp/showPhoto/closeProject`)
5. Mini-carousels (auto 4s)
6. `switchTab` terminal tabs
7. Typewriter (phrases: CpE Student / QA Automation / Arduino & Hardware Tinkerer / Aspiring App Developer)
8. **Lanyard free-rope physics** (React-Bits-lanyard style, 2D vanilla): card = free body (x,y,vx,vy) with GRAVITY 2600, air drag 0.9; strap = rope constraint that only pulls when taut (slack rope → free fall; ROPE_GIVE 10 elasticity, radial velocity bleed); card tilt = spring chasing strap angle + velocity lean (TILT_K 30, TILT_C 6); JS renders strap (height=dist, rotate to angle, origin at anchor) and badge (translate to clip point, rotate tilt) separately each frame; grab-anywhere with grab-offset, throw momentum ×18; tap<8px = flip + hop jolt; clip is a child of the badge
9. `skillDefs` — keycap definitions object
10. Canvas dot grid (GAP 26, GLOW 130; yellow dots near cursor; rAF-throttled) + **click sparks** (8 yellow squares burst from clicks on empty space, gravity 900, life 0.7s)
11. Scroll progress line
12. Cursor trail (lerp 0.14, grows ×2 over interactives, `pointer:fine` only)
13. About spotlight parallax: pointermove → normalized −1…1, lerp 0.08, writes `--mx/--my` onto `#aboutSpotlight`; CSS `.orbit-pin` calc()s the per-note drift (`--depth` 9–18); rAF loop self-stops when settled; `pointer:fine` + reduced-motion guarded

## 6. CSS Notables
- Sections are `background: transparent` so the fixed canvas shows through; `.yellow-bg` + footer stay opaque — but `#floatLayer` (z:0) rides ABOVE all section backgrounds and BELOW `.wrap` content (z:1), so the fallers persist across every section.
- `#modal-img` has `min-width: 0` — the fix for wide screenshots (flex items refuse to shrink below an image's intrinsic width; a 1592px PNG used to push the › button out of the modal) — and `object-fit: contain` so dashboards show whole.
- **Unified seam:** `section, footer { border-top: 2px black; box-shadow: 0 -8px 0 -3px yellow, 0 -22px 26px -18px rgba(black,.28) }` = "lifted sheet" transition.
- Every `section .wrap > h2::after` = 64×8px yellow accent bar.
- Signature: hard offset shadows (`Npx Npx 0`) on cards/buttons/terminal; keycap depth `0 6px 0`.
- Body cursor = data-URI SVG crosshair; links/buttons keep native pointer.
- Breakpoints: 880 / 680 / 500. Full `prefers-reduced-motion` block kills all motion incl. float layer + cursor trail.

## 7. Known Limitations / TODO
- `images/` cert photos missing → Certs tab shows `.svg` placeholders (EDIT-ME marked).
- SUZENTINEL & Amari project photos are placeholder `.svg`s too.
- `annotated/` folder documents the pre-redesign code — needs regeneration (a background task chip exists for this).
- Embedded browser test panes may freeze rAF — verify motion in a real browser.
- No contact form (mailto only); no dark mode (single locked palette by design).

## 8. Future Roadmap (owner-approved directions)
- Real cert/project screenshots; possible app-dev project section as the owner learns mobile dev; blog/notes page; deploy to GitHub Pages (`SuzetteLacson.github.io`).
