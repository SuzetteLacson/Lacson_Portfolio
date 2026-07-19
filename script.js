/* ==========================================================
   script.js — Portfolio Core Engine
   Handles:
     1. Project data (photos + blog-style write-ups)
     2. Capsule nav (mobile dropdown + scrollspy + scroll-reveal)
     3. Gallery 3D ring (tabs + drag-to-spin + auto-spin + no-gaps fill)
     4. Project detail modal (photo viewer + write-up renderer)
     5. Project card mini-carousels
     6. About terminal tab switcher
     7. Hero typewriter
     8. Hero ID lanyard (free rope physics: gravity, throw, dangle, flip)
     9. Skills keyboard (press a key → read its definition)
    10. Interactive dot-grid background (canvas)
    11. Scroll progress line
    12. Cursor trail (the yellow diamond chasing the mouse)
    13. About spotlight parallax (the fact notes drift with the mouse)
   (The falling tech objects are pure CSS — see #floatLayer in style.css)
========================================================== */

/* ---------- 1. PROJECT DATA ----------
   EDIT-ME: everything shown in a project popup lives here.
   Each project has:
     title        — heading of the popup
     story        — array of paragraphs (the STAR write-up, in plain words)
     tech         — technologies used
     framework    — frameworks / IDEs used
     languages    — programming languages used
     features     — bullet list of key features
     challenges   — what was hard and how it was handled
     contribution — what *I* specifically did
     photos       — image paths (first one shows on the card too)
   NOTE: SUZENTINEL & amari still use placeholder .svg images —
   drop real screenshots into images/ and update the paths. */
const projectPhotos = {

  SUZENTINEL: {
    title: "SUZENTINEL — AI Vision System",
    story: [
      "SUZENTINEL started as a personal problem: I had no idea where my screen time actually went, and manual time-logging never lasted more than a week. So I decided to build something that would do the watching for me.",
      "I designed and developed an AI-powered computer vision system in Python that monitors user activity in real time, then feeds everything into a Flask web dashboard where the data actually makes sense. It ended up replacing my manual logs completely — real productivity insights, zero spreadsheet discipline required."
    ],
    tech: "Computer vision, real-time activity tracking, web dashboard",
    framework: "Flask",
    languages: "Python, HTML/CSS",
    features: [
      "Real-time activity monitoring through computer vision",
      "Automatic screen-time tracking and session history",
      "Flask dashboard with live productivity insights",
      "Runs quietly in the background while you work"
    ],
    challenges: "One of the main challenges was reducing false-positive detections and preventing the computer vision pipeline from lagging. I optimized the system by adjusting the frame rate, which improved performance and made the monitoring process run more smoothly.",
    contribution: "Solo project — I designed the architecture, wrote the Python detection logic, and built the Flask dashboard end to end.",
    photos: [
      "images/SUZENTINEL_CS_IMAGES_DOCU/DASHBOARDTIMER.png",
      "images/SUZENTINEL_CS_IMAGES_DOCU/WORKINGSTAT.png",
      "images/SUZENTINEL_CS_IMAGES_DOCU/ABSENTSTAT.png",
      "images/SUZENTINEL_CS_IMAGES_DOCU/EATING_DRINKSTAT.png",
      "images/SUZENTINEL_CS_IMAGES_DOCU/SLEEPINGSTAT.png"
    ]
  },

  mazebot: {
    title: "MazeBot 2026 — Autonomous Robotics",
    story: [
      "MazeBot was our robotics team project: build a robot that can find its way out of a physical maze with no human help.",
      "We built it around an Arduino microcontroller with a sensor array for obstacle detection, and wrote the navigation logic in C++. Watching it take a wrong turn, correct itself, and finally clear the maze was easily one of the most satisfying moments of my degree so far."
    ],
    tech: "Arduino Uno, ultrasonic/IR sensor array, autonomous navigation",
    framework: "Arduino IDE",
    languages: "C++ (Arduino)",
    features: [
      "Fully autonomous maze navigation — no remote control",
      "Obstacle detection through a multi-sensor array",
      "Self-correcting decision logic when it hits a dead end",
      "Compact chassis built for tight maze corridors"
    ],
    challenges: "Sensor readings in the real world are messy — walls reflect differently, batteries drain, and the same code behaves differently between runs. Most of our debugging time went into calibrating the sensors and adding tolerances so the robot made consistent decisions.",
    contribution: "I focused on programming the navigation and obstacle-detection logic and calibrating the sensors, alongside hands-on debugging with the team during test runs.",
    photos: [
      "images/mzebot_bot.jpg",
      "images/mzebot_maze.jpg",
      "images/me_w_bot.jpg",
      "images/mzebotgrouppic.jpg"
    ]
  },

  amari: {
    title: "Amari Staycation — Booking Platform",
    story: [
      "This project was inspired by my experience at Amari Staycation, where reservations, invoices, and calendar updates were handled manually. Staff often had to edit invoices individually, verify bookings across platforms, and update availability records by hand, which created delays and increased the risk of scheduling errors. These recurring operational bottlenecks motivated our team to develop a more efficient and centralized reservation management solution.",
      "Our team developed a web-based booking and reservation platform with a SQL database backend that allows guests to check availability, make reservations online, and automatically generate invoices, reducing repetitive administrative work. The system was also designed with the goal of supporting Airbnb calendar synchronization for more accurate booking management while providing the business with a more professional online presence, improved customer trust, and a direct reservation channel."
    ],
    tech: "Web-based booking system with a SQL database backend",
    framework: "None — plain HTML, CSS & JavaScript",
    languages: "HTML, CSS, JavaScript, SQL",
    features: [
      "Live availability checking before booking",
      "Online reservation flow for guests",
      "SQL-backed records so dates never double-book",
      "Simple management view for the operations side"
    ],
    challenges: "One of the biggest challenges was integrating the booking system, invoice automation, database records, and planned Airbnb calendar synchronization into a single platform while coordinating tasks within the group. We also revised the interface several times to match the client’s preferred workflow, which helped me improve my teamwork, communication, and system integration skills.",
    contribution: "I contributed to the project planning, design, and frontend development of the booking platform. I helped design the reservation and invoice workflow, implemented the user interface using HTML, CSS, and JavaScript, and collaborated with the team to align the system with the client’s operational needs and preferred design.",
    photos: [
      "images/AMARI/AmariLogo.png",
      "images/AMARI/homepage.png",
      "images/AMARI/bookastay.png",
      "images/AMARI/invoice.png"
    ]
  }
};

/* ---------- 2. CAPSULE NAVIGATION ---------- */
document.addEventListener("DOMContentLoaded", () => {

  /* --- 2a. mobile dropdown open/close --- */
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const menuCloseBtn  = document.getElementById("menuCloseBtn");
  const navDropdown   = document.getElementById("navDropdown");
  const dropdownPills = document.querySelectorAll(".dropdown-pill");

  if (menuToggleBtn && menuCloseBtn && navDropdown) {
    menuToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navDropdown.classList.add("show");
      menuToggleBtn.setAttribute("aria-expanded", "true");
    });

    const closeMenu = () => {
      navDropdown.classList.remove("show");
      menuToggleBtn.setAttribute("aria-expanded", "false");
    };

    menuCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });

    // any link tap closes the menu
    dropdownPills.forEach(pill => pill.addEventListener("click", closeMenu));

    // clicking anywhere outside closes it too
    document.addEventListener("click", (e) => {
      if (!navDropdown.contains(e.target) && e.target !== menuToggleBtn) {
        closeMenu();
      }
    });
  }

  /* --- 2b. scrollspy: highlight the nav link of the section in view.
         Watches every section that has a nav link (data-section). --- */
  const navTargets = document.querySelectorAll("section[id], footer[id]");
  const allNavLinks = document.querySelectorAll("[data-section]");

  if ("IntersectionObserver" in window && navTargets.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      });
    }, {
      // a section counts as "current" when it crosses the middle of the screen
      rootMargin: "-40% 0px -55% 0px"
    });

    navTargets.forEach(sec => spy.observe(sec));

    // edge case: the footer is short, so it may never reach the middle
    // of the screen — force "Contact" active when scrolled to the bottom
    window.addEventListener("scroll", () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (atBottom) {
        allNavLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === "contact");
        });
      }
    }, { passive: true });
  }

  /* --- 2b-bis. hide the falling objects while the hero is on screen —
         they fade back in the moment you scroll into any other section.
         (See body.hero-in-view in style.css §2.) --- */
  const heroEl = document.getElementById("top");

  if ("IntersectionObserver" in window && heroEl) {
    const heroSpy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        document.body.classList.toggle("hero-in-view", entry.isIntersecting);
      });
    }, { threshold: 0.4 });

    heroSpy.observe(heroEl);
  }

  /* --- 2c. scroll-reveal: fade/slide elements in as they appear --- */
  // section titles join the reveal system automatically (no HTML edits
  // needed) — each "01 / ..." heading lifts in as you reach its section
  document.querySelectorAll("section .wrap > h2").forEach(h2 => h2.classList.add("reveal"));

  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealer.unobserve(entry.target);   // animate once, then leave it be
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealer.observe(el));
  } else {
    // very old browser? just show everything
    revealEls.forEach(el => el.classList.add("visible"));
  }

  /* --- 2c-bis. section slide transitions ---
     Whole sections glide up into place the first time you reach them
     (CSS does the motion — this only hands out the .section-in class). */
  const slideSections = document.querySelectorAll("section, footer");
  if ("IntersectionObserver" in window) {
    const slider = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-in");
          slider.unobserve(entry.target);   // slide in once, then stay
        }
      });
    }, { threshold: 0.06 });
    slideSections.forEach(sec => slider.observe(sec));
  } else {
    slideSections.forEach(sec => sec.classList.add("section-in"));
  }

  /* --- 2d. weighty scrolling: anchor clicks glide with a spring ---
     Instead of the browser's flat smooth-scroll, clicking a nav link
     runs a small spring simulation on the scroll position itself:
       acceleration = (target − position) × SPRING − velocity × DAMPING
     The damping is set slightly under critical, so the page overshoots
     the target by a hair and settles back — that's the "weight".
     A wheel/touch from the user cancels it instantly (they're the boss). */
  function springScrollTo(targetY) {
    let pos = window.scrollY;
    let vel = 0;
    let last = null;
    let cancelled = false;

    const cancel = () => { cancelled = true; };
    window.addEventListener("wheel", cancel, { once: true, passive: true });
    window.addEventListener("touchstart", cancel, { once: true, passive: true });

    function step(t) {
      if (cancelled) return;
      if (last === null) last = t;
      const dt = Math.min((t - last) / 1000, 0.033);
      last = t;

      const accel = (targetY - pos) * 42 - vel * 11;
      vel += accel * dt;
      pos += vel * dt;
      window.scrollTo({ top: pos, behavior: "instant" });

      if (Math.abs(targetY - pos) > 0.5 || Math.abs(vel) > 12) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo({ top: targetY, behavior: "instant" });
      }
    }
    requestAnimationFrame(step);
  }

  // wire it to every in-page link (nav, dropdown, scroll key, brand)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const y = link.getAttribute("href") === "#top"
          ? 0
          : target.getBoundingClientRect().top + window.scrollY;
        springScrollTo(y);
      });
    });
  }
});

/* ---------- 3. GALLERY 3D RING (tabs + drag-to-spin + auto-spin) ----------
   The math: photo i sits at  rotateY(i * step) translateZ(radius),
   where step = 360° / photo count. Rotating the parent .ring by
   -i * step brings photo i to the front — so JS only ever changes
   ONE number (the ring's angle) and CSS 3D does the rest.

   THE NO-GAPS RULE: a circle with only 2–4 photos on it shows big
   empty holes between them. So applyFilter() REPEATS the tab's photo
   set (cloning the <figure>s) until the circle holds at least
   MIN_SLOTS photos, and ringRadius() sizes the circle so neighbors
   sit almost touching (AIR px apart). Full ring, every tab, always.
   Adding photos in index.html needs zero changes here. */
const photoRing   = document.getElementById("photoRing");
const ringScene   = document.getElementById("ringScene");
const ringStage   = document.getElementById("ringStage");
const galleryTabs = document.querySelectorAll(".gallery-tab");

if (photoRing && ringScene) {
  const originalItems = Array.from(photoRing.querySelectorAll(".ring-item"));
  const MIN_SLOTS = 8;         // a full-looking circle needs at least this many
  const AIR       = 12;        // px of air between neighboring photos
  let ringVisible = [];        // everything standing on the circle (incl. repeats)
  let ringStep    = 0;         // degrees between neighboring photos
  let ringAngle   = 0;         // the ring's current rotation
  let ringHovered = false;
  let draggingRing = false;

  // the circle sizes itself from the SLOT COUNT: neighboring photos
  // sit one chord apart, and chord = 2 × radius × sin(180° / count),
  // so the radius that makes them almost touch (+AIR px) is:
  function ringRadius() {
    const count = Math.max(ringVisible.length, 2);
    const itemW = ringVisible[0] ? ringVisible[0].offsetWidth : 260;
    const snug   = (itemW + AIR) / (2 * Math.sin(Math.PI / count));
    const maxFit = ringScene.clientWidth / 2 - itemW / 4;  // don't spill out
    return Math.max(170, Math.min(snug, Math.max(maxFit, 200)));
  }

  // place the photos evenly around the circle
  function layoutRing() {
    if (!ringVisible.length) return;
    const r = ringRadius();
    ringStep = 360 / ringVisible.length;
    ringVisible.forEach((item, i) => {
      item.style.transform = `rotateY(${i * ringStep}deg) translateZ(${r}px)`;
    });
  }

  // rotate the ring + mark whichever photo now faces the viewer
  function applyRingRotation() {
    photoRing.style.transform = `rotateY(${ringAngle}deg)`;
    const n = ringVisible.length;
    let idx = Math.round(-ringAngle / ringStep) % n;
    if (idx < 0) idx += n;
    ringVisible.forEach((item, i) => item.classList.toggle("front", i === idx));
  }

  function spinRing(steps) {
    ringAngle -= steps * ringStep;
    applyRingRotation();
  }

  // show one category and rebuild a FULL circle for it
  function applyFilter(category) {
    // 1. throw away the repeats made for the previous tab
    photoRing.querySelectorAll(".ring-clone").forEach(clone => clone.remove());

    // 2. show only this tab's real photos
    originalItems.forEach(item => {
      item.classList.toggle("hidden", item.dataset.category !== category);
      item.classList.remove("front");
    });
    const chosen = originalItems.filter(item => !item.classList.contains("hidden"));

    // 3. the no-gaps rule: repeat the whole set (in order) until the
    //    circle is full — e.g. 2 certs become A·B·A·B·A·B·A·B
    //    EXCEPTION: certs are real documents, not decorative photos —
    //    repeating them reads as a mistake, so that tab shows its
    //    actual set only, gaps and all.
    ringVisible = chosen.slice();
    while (category !== "certs" && chosen.length && ringVisible.length < MIN_SLOTS) {
      chosen.forEach(src => {
        const clone = src.cloneNode(true);
        clone.classList.add("ring-clone");
        photoRing.appendChild(clone);
        ringVisible.push(clone);
      });
    }

    ringAngle = 0;
    layoutRing();
    applyRingRotation();
  }

  // tab clicks: move the .active pill + rebuild the ring
  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-pressed", t === tab ? "true" : "false");
      });
      applyFilter(tab.dataset.filter);
    });
  });

  // keycap arrow buttons (they float at the ring's edges)
  document.getElementById("ringPrev").addEventListener("click", () => spinRing(-1));
  document.getElementById("ringNext").addEventListener("click", () => spinRing(1));

  // drag to spin — pointer events cover mouse AND touch
  let dragStartX = 0;
  let dragStartAngle = 0;

  ringScene.addEventListener("pointerdown", (e) => {
    draggingRing = true;
    dragStartX = e.clientX;
    dragStartAngle = ringAngle;
    photoRing.classList.add("dragging");   // kills the CSS transition
    ringScene.classList.add("dragging");   // shows the grabbing cursor
    ringScene.setPointerCapture(e.pointerId);
  });

  ringScene.addEventListener("pointermove", (e) => {
    if (!draggingRing) return;
    // 0.25 = drag sensitivity: 4px of mouse travel = 1° of spin
    ringAngle = dragStartAngle + (e.clientX - dragStartX) * 0.25;
    applyRingRotation();
  });

  function endRingDrag() {
    if (!draggingRing) return;
    draggingRing = false;
    photoRing.classList.remove("dragging");
    ringScene.classList.remove("dragging");
    // snap to the nearest photo so the ring never rests crooked
    ringAngle = Math.round(ringAngle / ringStep) * ringStep;
    applyRingRotation();
  }
  ringScene.addEventListener("pointerup", endRingDrag);
  ringScene.addEventListener("pointercancel", endRingDrag);

  // pause auto-spin while the visitor is exploring
  ringStage.addEventListener("mouseenter", () => { ringHovered = true; });
  ringStage.addEventListener("mouseleave", () => { ringHovered = false; });

  // auto-spin every 5s (skipped for reduced-motion users)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      if (!ringHovered && !draggingRing) spinRing(1);
    }, 5000);
  }

  // re-space the circle if the window is resized — and once more after
  // the full page load, in case the first measurement happened before
  // the final layout settled (e.g. a scrollbar appearing late)
  window.addEventListener("resize", layoutRing);
  window.addEventListener("load", layoutRing);

  applyFilter("events");   // matches the tab marked active in the HTML
}

/* ---------- 4. PROJECT DETAIL MODAL ---------- */
let currentProject = null;
let photoIndex = 0;

function openProject(name) {
  currentProject = projectPhotos[name];
  if (!currentProject) return;
  photoIndex = 0;

  document.getElementById("modal-title").textContent = currentProject.title;

  // build the blog-style write-up from the project data
  document.getElementById("modal-body").innerHTML = buildWriteUp(currentProject);

  // clickable thumbnails
  const thumbsBox = document.getElementById("modal-thumbs");
  thumbsBox.innerHTML = "";
  for (let i = 0; i < currentProject.photos.length; i++) {
    const thumb = document.createElement("img");
    thumb.src = currentProject.photos[i];
    thumb.alt = `${currentProject.title} thumbnail ${i + 1}`;
    thumb.onclick = function () { showPhoto(i); };
    thumbsBox.appendChild(thumb);
  }

  showPhoto(0);
  document.getElementById("modal").classList.add("show");
  document.getElementById("modal-close-btn").focus();   // keyboard users land on Close
}

/* turns one project object into the write-up HTML.
   (All text comes from the projectPhotos data above — nothing external.) */
function buildWriteUp(p) {
  const storyHTML    = p.story.map(par => `<p class="modal-story">${par}</p>`).join("");
  const featuresHTML = p.features.map(f => `<li>${f}</li>`).join("");

  return `
    ${storyHTML}
    <dl class="modal-meta">
      <dt>Technologies</dt><dd>${p.tech}</dd>
      <dt>Framework</dt><dd>${p.framework}</dd>
      <dt>Languages</dt><dd>${p.languages}</dd>
    </dl>
    <h4>Key features</h4>
    <ul>${featuresHTML}</ul>
    <h4>Challenges</h4>
    <p>${p.challenges}</p>
    <h4>My contribution</h4>
    <p>${p.contribution}</p>
  `;
}

function showPhoto(index) {
  if (!currentProject) return;

  // circular wrapping so ‹ › never run out of photos
  photoIndex = (index + currentProject.photos.length) % currentProject.photos.length;

  const modalImg = document.getElementById("modal-img");
  modalImg.src = currentProject.photos[photoIndex];
  modalImg.alt = `${currentProject.title} — photo ${photoIndex + 1}`;

  // highlight the thumbnail being viewed
  const thumbs = document.getElementById("modal-thumbs").children;
  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.toggle("active", i === photoIndex);
  }
}

function movePhoto(step) {
  showPhoto(photoIndex + step);
}

function closeProject() {
  document.getElementById("modal").classList.remove("show");
  currentProject = null;
}

// Esc key closes the popup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProject();
});

/* ---------- 5. PROJECT CARD MINI-CAROUSELS ---------- */
const minis = document.querySelectorAll(".mini-carousel");
for (let m = 0; m < minis.length; m++) {
  buildMiniCarousel(minis[m]);
}

function buildMiniCarousel(box) {
  const projectKey = box.dataset.project;
  if (!projectPhotos[projectKey]) return;

  const photos = projectPhotos[projectKey].photos;
  let index = 0;

  // 1) the sliding photo track
  const miniTrack = document.createElement("div");
  miniTrack.className = "mini-track";
  for (let i = 0; i < photos.length; i++) {
    const img = document.createElement("img");
    img.src = photos[i];
    img.alt = projectPhotos[projectKey].title + " — photo " + (i + 1);
    img.loading = "lazy";          // don't download until near the viewport
    miniTrack.appendChild(img);
  }
  box.appendChild(miniTrack);

  // 2) the little dots
  const dots = document.createElement("div");
  dots.className = "mini-dots";
  for (let i = 0; i < photos.length; i++) {
    dots.appendChild(document.createElement("span"));
  }
  box.appendChild(dots);

  // 3) prev/next arrows (stopPropagation so the card click doesn't fire)
  const prev = document.createElement("button");
  prev.className = "mini-btn prev";
  prev.textContent = "‹";
  prev.setAttribute("aria-label", "Previous photo");
  prev.onclick = function (e) { e.stopPropagation(); show(index - 1); };
  box.appendChild(prev);

  const next = document.createElement("button");
  next.className = "mini-btn next";
  next.textContent = "›";
  next.setAttribute("aria-label", "Next photo");
  next.onclick = function (e) { e.stopPropagation(); show(index + 1); };
  box.appendChild(next);

  function show(n) {
    index = (n + photos.length) % photos.length;
    miniTrack.style.transform = "translateX(-" + index * 100 + "%)";
    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = (i === index) ? "active" : "";
    }
  }

  show(0);
  setInterval(function () { show(index + 1); }, 4000);
}

/* ---------- 6. ABOUT TERMINAL TAB SWITCHER ---------- */
function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  const clickedBtn = document.getElementById(`btn-${tabId}`);
  if (clickedBtn) clickedBtn.classList.add("active");

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) targetContent.classList.add("active");
}

/* ---------- 7. HERO TYPEWRITER ---------- */
// EDIT-ME: the rotating roles under the big name
const phrases = ["Computer Engineering Student", "QA Automation", "Arduino & Hardware Tinkerer", "Aspiring App Developer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
  if (!typewriterElement) return;
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 1500;              // hold the complete word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 400;               // small pause before the next word
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) type();
});

/* ---------- 8. HERO ID LANYARD (free-moving rope physics) ----------
   The card is a FREE BODY, like the trending 3D lanyard sites:
     · gravity pulls it down every frame
     · the strap is a rope constraint — it only pulls when TAUT.
       Lift the card above the hang point and the strap goes slack,
       so the card simply free-falls until the strap catches it.
     · the card's tilt is a spring chasing the strap's direction,
       so it dangles, leans into throws, and wobbles as it settles.
   Grab it, throw it, drop it. A tap (< 8px of travel) flips it. */
const lanyardWrap  = document.getElementById("lanyardWrap");
const lanyardStrap = document.getElementById("lanyardStrap");
const idBadge      = document.getElementById("idBadge");
const badgeInner   = document.getElementById("badgeInner");

if (lanyardWrap && lanyardStrap && idBadge) {
  const GRAVITY   = 2600;  // px/s² — how hard the card falls
  const ROPE_GIVE = 10;    // how quickly a taut strap reels the card in
  const AIR_DRAG  = 0.9;   // air resistance (per second)
  const TILT_K    = 30;    // tilt spring: chase the strap's angle
  const TILT_C    = 6;     // tilt damping: how fast the wobble dies

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const badgeW = idBadge.offsetWidth;

  let anchorX = 170;       // the hang point (wrap-local), set in layout()
  let ropeLen = 220;       // natural strap length, set in layout()

  // card state — (x, y) is the CLIP point at the card's top-center
  let x = 170, y = 220;
  let vx = 60, vy = 0;     // tiny push so it swings on page load
  let tilt = 0, tiltVel = 0;
  let holding = false;
  let downX = 0, downY = 0;
  let grabDX = 0, grabDY = 0;
  let lastTime = null;

  function layout() {
    anchorX = lanyardWrap.clientWidth / 2;
    ropeLen = Math.max(120,
      Math.min(240, lanyardWrap.clientHeight - idBadge.offsetHeight - 30));
  }

  // draw the current state: stretch+rotate the strap so it always
  // connects the anchor to the card's clip, then place the card
  function render() {
    const dx = x - anchorX;
    const dist = Math.max(30, Math.hypot(dx, y));
    const ropeDeg = -Math.atan2(dx, y) * 180 / Math.PI;
    lanyardStrap.style.height = dist + "px";
    lanyardStrap.style.transform = `translateX(-50%) rotate(${ropeDeg}deg)`;
    idBadge.style.transform =
      `translate(${x - badgeW / 2}px, ${y}px) rotate(${tilt}deg)`;
  }

  // the flip, plus a physical jolt: the card hops, drifts sideways,
  // and wobbles — then gravity and the strap sort it out
  function flipBadge() {
    badgeInner.classList.toggle("flipped");
    if (reduceMotion) return;
    vy -= 380;
    vx += (Math.random() < 0.5 ? -1 : 1) * 120;
    tiltVel += (Math.random() < 0.5 ? -1 : 1) * 160;
  }

  function frame(t) {
    if (lastTime === null) lastTime = t;
    const dt = Math.min((t - lastTime) / 1000, 0.033);  // seconds, capped
    lastTime = t;

    if (!holding) {
      // gravity + a whisper of breeze so it never looks frozen
      vy += GRAVITY * dt;
      vx += Math.sin(t / 1500) * 14 * dt;

      // air drag
      const drag = Math.max(0, 1 - AIR_DRAG * dt);
      vx *= drag;
      vy *= drag;

      x += vx * dt;
      y += vy * dt;

      // the strap only pulls when TAUT — slack rope = free fall
      const ddx = x - anchorX;
      const dist = Math.hypot(ddx, y);
      if (dist > ropeLen) {
        const nx = ddx / dist, ny = y / dist;
        // reel the card back toward the rope's end (elastic, not rigid)
        const give = Math.min(1, ROPE_GIVE * dt);
        x -= nx * (dist - ropeLen) * give;
        y -= ny * (dist - ropeLen) * give;
        // bleed off outward speed so it swings instead of yo-yoing
        const radial = vx * nx + vy * ny;
        if (radial > 0) {
          const k = Math.min(1, 10 * dt);
          vx -= nx * radial * k;
          vy -= ny * radial * k;
        }
      }
    }

    // tilt chases the strap's direction (+ a lean when moving fast),
    // which is what makes it dangle instead of staying stiff
    const ropeDeg = -Math.atan2(x - anchorX, y) * 180 / Math.PI;
    const lean = Math.max(-24, Math.min(24, vx * 0.04));
    tiltVel += ((ropeDeg + lean) - tilt) * TILT_K * dt - tiltVel * TILT_C * dt;
    tilt += tiltVel * dt;

    render();
    requestAnimationFrame(frame);
  }

  idBadge.addEventListener("pointerdown", (e) => {
    holding = true;
    downX = e.clientX;
    downY = e.clientY;
    // remember where ON the card it was grabbed, so it doesn't jump
    const rect = lanyardWrap.getBoundingClientRect();
    grabDX = (e.clientX - rect.left) - x;
    grabDY = (e.clientY - rect.top) - y;
    idBadge.classList.add("grabbing");
    idBadge.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  idBadge.addEventListener("pointermove", (e) => {
    if (!holding) return;
    const rect = lanyardWrap.getBoundingClientRect();
    const nx = Math.max(-140, Math.min(lanyardWrap.clientWidth + 140,
                 (e.clientX - rect.left) - grabDX));
    const ny = Math.max(-40, Math.min(lanyardWrap.clientHeight + 60,
                 (e.clientY - rect.top) - grabDY));
    // velocity from the movement → a release keeps the throw's momentum
    vx = (nx - x) * 18;
    vy = (ny - y) * 18;
    x = nx;
    y = ny;
    if (reduceMotion) render();   // no loop running — draw directly
  });

  idBadge.addEventListener("pointerup", (e) => {
    if (!holding) return;
    holding = false;
    idBadge.classList.remove("grabbing");
    const dragDistance = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (dragDistance < 8) flipBadge();       // a tap, not a throw
    if (reduceMotion) {                      // no physics — snap home
      x = anchorX; y = ropeLen; tilt = 0;
      render();
    }
  });

  idBadge.addEventListener("pointercancel", () => {
    holding = false;
    idBadge.classList.remove("grabbing");
  });

  // keyboard users: Enter or Space flips the badge
  idBadge.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipBadge();
    }
  });

  window.addEventListener("resize", layout);

  layout();
  x = anchorX;
  y = ropeLen;
  render();
  if (!reduceMotion) requestAnimationFrame(frame);
}

/* ---------- 9. SKILLS KEYBOARD ----------
   EDIT-ME: each keycap's readout lives here. The button's data-skill
   in index.html must match a key in this object. */
const skillDefs = {
  python:  { name: "Python",            cat: "LANGUAGE",      text: "My main language — automation scripts and the brains of SUZENTINEL." },
  cpp:     { name: "C++ (Arduino)",     cat: "LANGUAGE",      text: "What MazeBot thinks in — navigation logic on the microcontroller." },
  js:      { name: "JavaScript",        cat: "LANGUAGE",      text: "Every animation on this site is hand-written JS — zero libraries." },
  sql:     { name: "SQL",               cat: "LANGUAGE",      text: "Keeps the Amari booking platform's data honest — no double bookings." },
  html:    { name: "HTML",              cat: "FRONTEND",      text: "The skeleton of every page I build, this one included." },
  css:     { name: "CSS",               cat: "FRONTEND",      text: "This site's whole look: 3 colors, 2 fonts, lots of borders." },
  flask:   { name: "Flask",             cat: "FRAMEWORK",     text: "Python micro-framework behind SUZENTINEL's dashboard." },
  maestro: { name: "Maestro",           cat: "QA / AUTOMATION", text: "Mobile UI test automation — my daily tool at Pick.A.Roo." },
  android: { name: "Android Studio",    cat: "QA / AUTOMATION", text: "Where I run and debug the Merchant App test builds." },
  gas:     { name: "Google Apps Script", cat: "QA / AUTOMATION", text: "Automates the boring spreadsheet work." },
  git:     { name: "Git / GitHub",      cat: "TOOL",          text: "Version control — how this site is tracked and shipped." },
  vscode:  { name: "VS Code",           cat: "TOOL",          text: "My editor. This site was written in it." },
  arduino: { name: "Arduino IDE",       cat: "TOOL",          text: "Where robot code gets compiled and flashed to the board." },
  linux:   { name: "Linux Mint",        cat: "TOOL",          text: "My Linux sandbox, running inside Oracle VM VirtualBox." },
  lm:      { name: "LM Studio",         cat: "TOOL",          text: "Running AI models locally on my own machine." },
  ai:      { name: "AI Tools",          cat: "TOOL",          text: "ChatGPT & Claude — pair programmers for debugging and learning faster." },
  cad:     { name: "AutoCAD / Fusion 360", cat: "TOOL",       text: "CAD for engineering drawings and 3D-printable parts." },
  sim:     { name: "Tinkercad / Multisim", cat: "TOOL",       text: "Simulating circuits before touching real wires." },
  pm:      { name: "Trello / Notion",   cat: "TOOL",          text: "Where my projects and school work stay organized." },
  office:  { name: "MS Office / Google Workspace", cat: "TOOL", text: "Docs, sheets, and decks — the universal toolkit." },
  ccna:    { name: "CCNA 1 & 2",        cat: "CERTIFICATION", text: "Cisco Certified Network Associate — networking fundamentals, routing & switching." }
};

const screenTextEl = document.getElementById("screenText");
const screenTagEl  = document.getElementById("screenTag");

if (screenTextEl) {
  document.querySelectorAll(".keycap").forEach(cap => {
    cap.addEventListener("click", () => {
      const def = skillDefs[cap.dataset.skill];
      if (!def) return;
      screenTagEl.textContent  = def.cat;
      screenTextEl.textContent = `${def.name} — ${def.text}`;
      // brief press animation (matters for keyboard/Enter users)
      cap.classList.add("pressed");
      setTimeout(() => cap.classList.remove("pressed"), 140);
    });
  });
}

/* ---------- 10. INTERACTIVE DOT-GRID BACKGROUND ----------
   A fixed <canvas> behind everything draws a faint grid of dots;
   dots near the cursor grow and turn yellow. It only redraws when
   the pointer actually moves (requestAnimationFrame-throttled). */
const bgCanvas = document.getElementById("bgGrid");

if (bgCanvas) {
  const ctx  = bgCanvas.getContext("2d");
  const GAP  = 26;     // px between dots
  const GLOW = 130;    // how far the cursor's influence reaches
  let mouseX = -9999, mouseY = -9999;   // start far away = no glow
  let redrawQueued = false;
  const sparks = [];   // click-spark particles (see below)

  function drawGrid() {
    redrawQueued = false;
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let x = GAP; x < bgCanvas.width; x += GAP) {
      for (let y = GAP; y < bgCanvas.height; y += GAP) {
        const dist = Math.hypot(x - mouseX, y - mouseY);

        if (dist < GLOW) {
          // near the cursor: yellow dot, bigger the closer it is
          const pull = 1 - dist / GLOW;              // 1 at cursor → 0 at edge
          ctx.fillStyle   = `rgba(232, 242, 76, ${0.35 + pull * 0.65})`;
          ctx.strokeStyle = `rgba(17, 17, 17, ${0.15 + pull * 0.45})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + pull * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // everywhere else: a faint dark speck
          ctx.fillStyle = "rgba(17, 17, 17, 0.10)";
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
    }

    // any live click-sparks draw on top of the grid
    for (const s of sparks) {
      ctx.globalAlpha = Math.max(0, s.life / 0.7);   // fade out over life
      ctx.fillStyle = "#E8F24C";
      ctx.strokeStyle = "#111111";
      ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
      ctx.strokeRect(s.x - 3, s.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;
  }

  function queueRedraw() {
    if (!redrawQueued) {
      redrawQueued = true;
      requestAnimationFrame(drawGrid);
    }
  }

  function sizeCanvas() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    drawGrid();
  }

  // --- click sparks: clicking empty space bursts little yellow
  //     squares that fly out and fall with gravity, then fade ---
  let sparkTicking = false;
  let sparkLast = null;

  function sparkTick(t) {
    if (sparkLast === null) sparkLast = t;
    const dt = Math.min((t - sparkLast) / 1000, 0.033);
    sparkLast = t;

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.vy += 900 * dt;            // sparks feel gravity too
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }

    drawGrid();
    if (sparks.length) {
      requestAnimationFrame(sparkTick);
    } else {
      sparkTicking = false;
      sparkLast = null;
    }
  }

  // reduced-motion users get the static grid — no glow, no sparks
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      queueRedraw();
    });

    window.addEventListener("pointerdown", (e) => {
      // only on "empty" space — never steal a real interaction
      if (!e.target || !e.target.closest || e.target.closest(
        "a, button, .keycap, .id-badge, .ring-scene, .terminal, .modal-box, .project, input, textarea")) return;
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp  = 120 + Math.random() * 220;
        sparks.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 80,   // slight upward bias
          life: 0.7
        });
      }
      if (!sparkTicking) {
        sparkTicking = true;
        requestAnimationFrame(sparkTick);
      }
    });
  }

  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();
}

/* ---------- 11. SCROLL PROGRESS LINE ----------
   The yellow line at the very top of the page. Its width is simply
   "how far down am I?" as a percentage of the total scrollable height. */
const progressLine = document.getElementById("scrollProgress");

if (progressLine) {
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressLine.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

/* ---------- 12. CURSOR TRAIL ----------
   A little yellow diamond that chases the mouse using "lerp"
   (linear interpolation): every frame it moves 14% of the remaining
   distance toward the pointer, which gives that smooth lag. It grows
   over anything clickable. Mouse-only: the (pointer: fine) check
   keeps it off phones and tablets, where it would make no sense. */
const cursorTrail = document.getElementById("cursorTrail");

if (cursorTrail
    && window.matchMedia("(pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

  cursorTrail.style.display = "block";

  let aimX = -100, aimY = -100;      // where the mouse actually is
  let trailX = -100, trailY = -100;  // where the diamond is right now
  let grow = 1;

  window.addEventListener("pointermove", (e) => {
    aimX = e.clientX;
    aimY = e.clientY;
    // grow over anything interactive
    const hot = e.target.closest &&
      e.target.closest("a, button, .keycap, .ring-scene, .id-badge, .project");
    grow = hot ? 2 : 1;
  });

  (function chase() {
    trailX += (aimX - trailX) * 0.14;
    trailY += (aimY - trailY) * 0.14;
    cursorTrail.style.transform =
      `translate(${trailX - 6}px, ${trailY - 6}px) rotate(45deg) scale(${grow})`;
    requestAnimationFrame(chase);
  })();
}

/* ---------- 13. ABOUT SPOTLIGHT PARALLAX ----------
   Makes the About fact-notes drift as the mouse moves over the
   spotlight, each at its own depth — which is what sells the "notes
   floating around me in space" illusion.

   DATA TRANSFER (JS → CSS): this code never touches a note directly.
   It converts the cursor position into two numbers between −1 and 1
   (--mx and --my) and writes them onto the CONTAINER as CSS custom
   properties. Over in style.css, every .orbit-pin runs
       translate( calc(--mx × --depth × -1px), … )
   with its own --depth value — so one pair of numbers moves six notes
   by six different amounts. CSS variables act as the data bridge.

   The values are eased with lerp (move 8% of the remaining distance
   each frame), so the notes glide instead of twitching.
   Desktop-mouse only, and off for reduced-motion users. */
const spotlightEl = document.getElementById("aboutSpotlight");

if (spotlightEl
    && window.matchMedia("(pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

  let aimMX = 0, aimMY = 0;   // where the cursor wants the drift to be
  let curMX = 0, curMY = 0;   // where the drift actually is right now
  let driftRunning = false;

  spotlightEl.addEventListener("pointermove", (e) => {
    const box = spotlightEl.getBoundingClientRect();
    // cursor position inside the spotlight, mapped to −1 … 1
    aimMX = ((e.clientX - box.left) / box.width  - 0.5) * 2;
    aimMY = ((e.clientY - box.top)  / box.height - 0.5) * 2;
    startDrift();
  });

  // mouse leaves → every note glides back to its home position
  spotlightEl.addEventListener("pointerleave", () => {
    aimMX = 0;
    aimMY = 0;
    startDrift();
  });

  // only run the animation loop while there's distance left to cover
  function startDrift() {
    if (!driftRunning) {
      driftRunning = true;
      requestAnimationFrame(driftStep);
    }
  }

  function driftStep() {
    curMX += (aimMX - curMX) * 0.08;
    curMY += (aimMY - curMY) * 0.08;

    // the hand-off to CSS: two custom properties on the container
    spotlightEl.style.setProperty("--mx", curMX.toFixed(4));
    spotlightEl.style.setProperty("--my", curMY.toFixed(4));

    if (Math.abs(aimMX - curMX) > 0.002 || Math.abs(aimMY - curMY) > 0.002) {
      requestAnimationFrame(driftStep);
    } else {
      driftRunning = false;         // arrived — stop burning frames
    }
  }
}
