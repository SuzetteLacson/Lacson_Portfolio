# Portfolio Website — Owner's Guide

Your project is now split into 3 small files — the standard beginner-friendly structure:

| File | Job |
|---|---|
| `index.html` | The content — your text, images, sections |
| `style.css` | The design — colors, fonts, layout, mobile view |
| `script.js` | The behavior — carousel + mobile menu |
| `images/` | Your photos go here |

**Do I need CSS?** Yes — without `style.css` the page is plain black text on white. HTML is the skeleton, CSS is the appearance, JavaScript is the movement. Keeping them in separate files is exactly how you'd explain a clean project structure to a supervisor.

---

## 1. Open & preview in VS Code

1. VS Code → **File → Open Folder** → this `Portfolio` folder.
2. If the bottom-left says **Restricted Mode**, click it → **Trust Folder**.
3. Install the **Live Server** extension (Ctrl+Shift+X → search "Live Server" → the one by Ritwick Dey → Install).
4. Open `index.html`, click **Go Live** (bottom-right). The page auto-refreshes every time you save.

## 2. Put in your real info

Ctrl+F in `index.html` and search **`EDIT-ME`** — every placeholder is marked.

**Your photos:**
1. Copy your pictures into the `images` folder (jpg or png).
2. In `index.html`, change the `src`. Example:
   `<img src="images/activity1.svg">` → `<img src="images/hackathon.jpg">`
3. The `.svg` files currently there are just placeholders — delete them once your real photos are in.

**Add a carousel photo:** copy one whole `<figure class="slide">...</figure>` block, paste it below the last one, change the image and caption. The dots and arrows adjust automatically — no JS editing needed.

**Add a project:** copy an `<article class="card project">...</article>` block.

**Project popup photos (click a card → 4 photos):**
1. Open `script.js` — the `projectPhotos` list is right at the top.
2. Each project has a `title` and 4 photo paths. Change them to your real pictures (put the files in `images/` first).
3. The name like `taskpilot:` must match the card's `onclick="openProject('taskpilot')"` in `index.html`. When adding a new project, add both: a new entry in `projectPhotos` and the matching `onclick` on the new card.
4. Popup closes with the ✕ button, the Esc key, or clicking the dark background.
**Add a skill:** add `<span class="pill">Name</span>` (use `class="pill hl"` to highlight).
**Add experience:** copy a `<div class="t-item">...</div>` block.
**Resume:** drop `resume.pdf` into this folder — the footer button already points to it.

## 3. How each file works (explain-to-supervisor cheat sheet)

### index.html
Semantic HTML: `<nav>`, `<header>`, `<section>`, `<article>`, `<footer>` describe *meaning*, not just boxes — good for accessibility and SEO. Sections are numbered comments matching the page order.

### style.css (12 numbered sections)
- **CSS variables** (`:root`) — the 3 colors and 2 fonts are defined once; `var(--yellow)` reuses them. Change one line to re-theme the whole site.
- **Flexbox** — used for the navbar, hero, buttons, pills (things in a row that wrap).
- **CSS Grid** — used for project cards: `repeat(auto-fill, minmax(280px, 1fr))` means "fit as many 280px-wide cards per row as possible" — responsive with zero media queries.
- **The carousel trick** — all slides sit in one long row (`display:flex`), the window has `overflow:hidden` so only one shows, and JS slides the row with `transform: translateX(-100%)` per step.
- **`object-fit: cover`** — crops photos to fill their box without stretching. Your pictures can be any size.
- **One media query** (≤680px) — swaps the nav for a hamburger menu, stacks the hero, shrinks photos.
- **Hover effects** — project cards tilt (`rotate(-1deg)`) with a hard offset shadow, like a taped sticker.

### script.js (~40 lines, fully commented)
- `toggleMenu()` — adds/removes the `open` class; CSS does the showing/hiding.
- Carousel — one variable `current` tracks the visible slide; `goToSlide(n)` moves the track; the `%` remainder makes it loop; dots are generated automatically (one per slide); `setInterval` auto-plays every 5 s.

**Key line to explain:** `track.style.transform = "translateX(-" + current * 100 + "%)"` — slide 0 = 0%, slide 1 = −100%, slide 2 = −200%. That's the whole carousel.

## 4. Likely supervisor questions

- **"Why no framework like React?"** — A static portfolio doesn't need one. Plain HTML/CSS/JS = zero dependencies, instant load, deploys anywhere, and I can explain every line. For an app with dynamic data, I'd use React.
- **"Why 3 files?"** — Separation of concerns: content / presentation / behavior. Industry-standard structure at this scale.
- **"Is it responsive?"** — Yes: auto-wrapping grid, flexible layouts, and a mobile breakpoint at 680px. Demo it with F12 → device toolbar.
- **"How does the carousel work?"** — See the key line above; no library needed.
- **"How is it deployed?"** — GitHub Pages (below).

## 5. Deploy to GitHub Pages

1. Create a repo on GitHub (e.g. `portfolio`).
2. Upload the whole folder contents: `index.html`, `style.css`, `script.js`, the `images` folder, `resume.pdf`.
3. Repo → **Settings → Pages** → Source: `main` branch, root → Save.
4. Live at `https://yourusername.github.io/portfolio/` in a minute or two.

## 6. Quick tweak recipes

- **Change accent color:** edit `--yellow: #E8F24C;` at the top of `style.css`.
- **Carousel speed:** in `script.js`, change `5000` (milliseconds) in the last `setInterval` line. Delete that line to turn off auto-play.
- **Taller gallery photos:** in `style.css`, `.slide img { height: 380px; }`.
- **Stronger card tilt:** `.project:hover` → change `-1deg` to `-2deg`.
- **Reorder sections:** cut/paste an entire `<section>` block in `index.html`, and reorder the nav links to match.
