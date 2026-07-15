/* ==========================================================
   script.js — the small amount of JavaScript this site needs.
   Three jobs:
     1. the mobile hamburger menu
     2. the gallery carousel (arrows + dots + auto-play)
     3. the project photo popup (click a card → 4 photos)
========================================================== */

/* ---------- PROJECT PHOTOS & DESCRIPTIONS (EDIT-ME!) ---------- */
const projectPhotos = {
  SUZENTINEL: {
    title: "SUZENTINEL — AI Vision System",
    description: "Users previously lacked an automated way to track screen time and productivity. To address this, I was tasked with designing a real-time tracking architecture. I built an AI-powered computer vision system utilizing Python and an interactive Flask dashboard. This solution successfully delivered real-time productivity insights, effectively replacing manual time-logging and allowing users to optimize their workflow.",
    photos: [
      "images/project1.svg",
      "images/activity1.svg",
      "images/activity2.svg",
      "images/activity3.svg"
    ]
  },
  mazebot: {
    title: "MazeBot 2026 — Autonomous Robotics",
    description: "There was a need for a physical demonstration of algorithmic pathfinding to showcase autonomous navigation capabilities. I engineered an autonomous maze-solving unit using an Arduino microcontroller. By programming the robot to utilize advanced sensor arrays and obstacle detection algorithms, it successfully navigated complex physical mazes with highly optimized routing.",
    photos: [
      "images/project2.svg",
      "images/activity2.svg",
      "images/activity4.svg",
      "images/activity1.svg"
    ]
  },
  amari: {
    title: "Amari Staycation — Booking Platform",
    description: "Amari Staycation originally relied on manual reservation tracking, which led to operational bottlenecks. I was tasked with developing an automated digital booking solution to streamline their process. I engineered a comprehensive web-based platform featuring a SQL backend to accurately check availability and manage data. This implementation successfully modernized their online reservations, drastically improving the property's overall operational efficiency.",
    photos: [
      "images/project3.svg",
      "images/activity3.svg",
      "images/activity1.svg",
      "images/activity4.svg"
    ]
  }
};

/* ---------- 1. MOBILE MENU ---------- */
function toggleMenu() {
  document.getElementById("navlinks").classList.toggle("open");
}

/* ---------- 2. CAROUSEL ---------- */
const track  = document.getElementById("track");   
const slides = track.children;                     
const dotsBox = document.getElementById("dots");   

let current = 0;                                   

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement("button");
  dot.onclick = function () { goToSlide(i); };     
  dotsBox.appendChild(dot);
}

function goToSlide(n) {
  current = n;
  track.style.transform = "translateX(-" + current * 100 + "%)";
  updateDots();
}

function moveSlide(step) {
  const n = (current + step + slides.length) % slides.length;
  goToSlide(n);
}

function updateDots() {
  for (let i = 0; i < dotsBox.children.length; i++) {
    if (i === current) {
      dotsBox.children[i].classList.add("active");
    } else {
      dotsBox.children[i].classList.remove("active");
    }
  }
}

setInterval(function () { moveSlide(1); }, 5000);
updateDots();

/* ---------- 3. PROJECT PHOTO POPUP ---------- */
let currentProject = null;   
let photoIndex = 0;          

function openProject(name) {
  currentProject = projectPhotos[name];
  photoIndex = 0;

  // set the popup title & description
  document.getElementById("modal-title").textContent = currentProject.title;
  document.getElementById("modal-desc").textContent = currentProject.description;

  // build the 4 thumbnails
  const thumbsBox = document.getElementById("modal-thumbs");
  thumbsBox.innerHTML = "";                    
  for (let i = 0; i < currentProject.photos.length; i++) {
    const thumb = document.createElement("img");
    thumb.src = currentProject.photos[i];
    thumb.onclick = function () { showPhoto(i); };  
    thumbsBox.appendChild(thumb);
  }

  showPhoto(0);                                
  document.getElementById("modal").classList.add("show");   
}


/* ---------- 4. MINI-CAROUSELS on the project cards ----------
   Finds every <div class="mini-carousel" data-project="...">,
   reads which project it belongs to, and builds a small slider
   with the 4 photos from projectPhotos. So you only edit photos
   in ONE place (the projectPhotos list at the top). */

const minis = document.querySelectorAll(".mini-carousel");

for (let m = 0; m < minis.length; m++) {
  buildMiniCarousel(minis[m]);
}

function buildMiniCarousel(box) {
  // which project? read it from data-project="..."
  const photos = projectPhotos[box.dataset.project].photos;
  let index = 0;

  // 1) the sliding row of images
  const miniTrack = document.createElement("div");
  miniTrack.className = "mini-track";
  for (let i = 0; i < photos.length; i++) {
    const img = document.createElement("img");
    img.src = photos[i];
    miniTrack.appendChild(img);
  }
  box.appendChild(miniTrack);

  // 2) the dots
  const dots = document.createElement("div");
  dots.className = "mini-dots";
  for (let i = 0; i < photos.length; i++) {
    dots.appendChild(document.createElement("span"));
  }
  box.appendChild(dots);

  // 3) the arrows — stopPropagation so clicking an arrow
  //    slides the photo instead of opening the popup
  const prev = document.createElement("button");
  prev.className = "mini-btn prev";
  prev.textContent = "‹";
  prev.onclick = function (e) { e.stopPropagation(); show(index - 1); };
  box.appendChild(prev);

  const next = document.createElement("button");
  next.className = "mini-btn next";
  next.textContent = "›";
  next.onclick = function (e) { e.stopPropagation(); show(index + 1); };
  box.appendChild(next);

  // slide to photo n (loops around at both ends)
  function show(n) {
    index = (n + photos.length) % photos.length;
    miniTrack.style.transform = "translateX(-" + index * 100 + "%)";
    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = (i === index) ? "active" : "";
    }
  }

  show(0);                                   // start on the first photo
  setInterval(function () { show(index + 1); }, 4000);   // auto-slide every 4s
}

/* ---------- 4. TERMINAL TAB SWITCHER ---------- */
function switchTab(tabId) {
  // Remove active state from all buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Remove active state from all tab panels
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Find targeted active elements
  const clickedBtn = Array.from(buttons).find(btn => btn.textContent.includes(tabId));
  if (clickedBtn) clickedBtn.classList.add('active');

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) targetContent.classList.add('active');
}

/* ---------- 5. HERO TYPEWRITER ANIMATION ---------- */
const phrases = ["Computer Engineer", "QA Automation Engineer", "Full-Stack Dev"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
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
    typeSpeed = 1500; // Pause at full phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 400; // Pause before next word
  }

  setTimeout(type, typeSpeed);
}

// Start typewriter effect on load
document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) type();
});