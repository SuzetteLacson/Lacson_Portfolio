/* ==========================================================
   script.js — Portfolio Core Engine
   Handles:
     1. Project data (photos + blog-style write-ups)
     2. Capsule nav (mobile dropdown + scrollspy active pill)
     3. Gallery photo strip (expanding accordion + auto-cycle)
     4. Project detail modal (photo viewer + write-up renderer)
     5. Project card mini-carousels
     6. About terminal tab switcher
     7. Hero typewriter
     8. Scroll-reveal animations
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
    challenges: "Getting the vision pipeline to run continuously without eating the CPU was the hardest part. I had to tune how often frames get processed and keep the dashboard queries light, so the tool never slows down the machine it's supposed to be monitoring.",
    contribution: "Solo project — I designed the architecture, wrote the Python detection logic, and built the Flask dashboard end to end.",
    photos: [
      "images/project1.svg",
      "images/activity1.svg",
      "images/activity2.svg",
      "images/activity3.svg"
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
      "This one came straight from my day job. At Amari Staycation, reservations were tracked manually, and I watched the same bottlenecks happen every week — double-checking dates, chasing confirmations, updating calendars by hand.",
      "So I proposed and built a web-based booking platform: guests can check availability and reserve online, with a SQL database keeping every booking accurate behind the scenes. It modernized how the property handles reservations and cut out most of the manual back-and-forth."
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
    challenges: "A booking system is only useful if availability is never wrong. Most of my time went into designing the SQL side — making sure dates couldn't overlap and records stayed consistent no matter how bookings came in.",
    contribution: "I built the platform end to end — frontend, booking flow, and the SQL database design — while coordinating requirements with the operations side (which, conveniently, was also me).",
    photos: [
      "images/project3.svg",
      "images/activity3.svg",
      "images/activity1.svg",
      "images/activity4.svg"
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

  /* --- 2c. scroll-reveal: fade/slide elements in as they appear --- */
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
});

/* ---------- 3. GALLERY PHOTO STRIP (tabs + expanding accordion) ----------
   The category tabs show only the photos whose data-category matches.
   Visible photos share one flex row; the .active one gets flex: 3.5
   and CSS animates the change. Hover, tap, or focus any photo to
   expand it. Auto-cycles like a carousel until the visitor interacts. */
const photoStrip  = document.getElementById("photoStrip");
const galleryTabs = document.querySelectorAll(".gallery-tab");

if (photoStrip) {
  const allItems = Array.from(photoStrip.querySelectorAll(".strip-item"));
  let visibleItems = [];
  let stripIndex = 0;
  let stripHovered = false;

  function setStripActive(n) {
    if (!visibleItems.length) return;
    stripIndex = (n + visibleItems.length) % visibleItems.length;
    visibleItems.forEach((item, i) => {
      item.classList.toggle("active", i === stripIndex);
    });
  }

  // show only the photos of one category, then expand its first photo
  function applyFilter(category) {
    allItems.forEach(item => {
      item.classList.toggle("hidden", item.dataset.category !== category);
      item.classList.remove("active");
    });
    visibleItems = allItems.filter(item => !item.classList.contains("hidden"));
    setStripActive(0);
  }

  allItems.forEach(item => {
    const activate = () => {
      const i = visibleItems.indexOf(item);
      if (i !== -1) setStripActive(i);
    };
    item.addEventListener("mouseenter", activate);  // desktop hover
    item.addEventListener("click",      activate);  // mobile tap
    item.addEventListener("focus",      activate);  // keyboard
  });

  // tab clicks: move the .active pill + re-filter the strip
  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-pressed", t === tab ? "true" : "false");
      });
      applyFilter(tab.dataset.filter);
    });
  });

  // pause the auto-cycle while the visitor is exploring
  photoStrip.addEventListener("mouseenter", () => { stripHovered = true; });
  photoStrip.addEventListener("mouseleave", () => { stripHovered = false; });

  // auto-advance every 4.5s (skipped for reduced-motion users)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      if (!stripHovered) setStripActive(stripIndex + 1);
    }, 4500);
  }

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
