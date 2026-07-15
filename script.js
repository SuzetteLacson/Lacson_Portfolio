/* ==========================================================
   script.js — Portfolio Core Engine
   Handles: 
     1. Floating Capsule Nav Dock Interactions
     2. Main Gallery Carousel (Dynamic Dots + Auto-play)
     3. Project Cards (Dynamic Mini-Carousels)
     4. High-Performance Project View Modal (Fixed Missing Functions)
     5. Developer Terminal Tab Interfaces
     6. Hero Text Terminal Simulation Engine
========================================================== */

/* ---------- PROJECT PHOTOS & DESCRIPTIONS DATA ---------- */
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

/* ---------- 1. FLOATING CAPSULE NAVIGATION DOCK ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const navDropdown = document.getElementById('navDropdown');
  const dropdownPills = document.querySelectorAll('.dropdown-pill');

  if (menuToggleBtn && menuCloseBtn && navDropdown) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navDropdown.classList.add('show');
    });

    menuCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navDropdown.classList.remove('show');
    });

    dropdownPills.forEach(pill => {
      pill.addEventListener('click', () => {
        navDropdown.classList.remove('show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target) && e.target !== menuToggleBtn) {
        navDropdown.classList.remove('show');
      }
    });
  }
});

/* ---------- 2. MAIN GALLERY CAROUSEL ---------- */
const track = document.getElementById("track");   
const dotsBox = document.getElementById("dots");   
let current = 0;                                   

if (track && dotsBox) {
  const slides = track.children; 

  // Dynamically generate navigation dots
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.onclick = function () { goToSlide(i); };     
    dotsBox.appendChild(dot);
  }

  function goToSlide(n) {
    current = n;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    updateDots();
  }

  function moveSlide(step) {
    current = (current + step + slides.length) % slides.length;
    goToSlide(current);
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

  // Auto-play routine loop every 5 seconds
  setInterval(function () { moveSlide(1); }, 5000);
  updateDots();
}

/* ---------- 3. PROJECT PHOTO POPUP (MODAL ENGINE) ---------- */
let currentProject = null;   
let photoIndex = 0;          

function openProject(name) {
  currentProject = projectPhotos[name];
  if (!currentProject) return;
  photoIndex = 0;

  // Set structural details text content Safely
  document.getElementById("modal-title").textContent = currentProject.title;
  document.getElementById("modal-desc").textContent = currentProject.description;

  // Render clickable interactive image thumbnails
  const thumbsBox = document.getElementById("modal-thumbs");
  thumbsBox.innerHTML = "";                    
  
  for (let i = 0; i < currentProject.photos.length; i++) {
    const thumb = document.createElement("img");
    thumb.src = currentProject.photos[i];
    thumb.alt = `${currentProject.title} thumbnail index ${i}`;
    thumb.onclick = function () { showPhoto(i); };  
    thumbsBox.appendChild(thumb);
  }

  showPhoto(0);                                
  document.getElementById("modal").classList.add("show");   
}

// FIX: Added the missing core visibility controls
function showPhoto(index) {
  if (!currentProject) return;
  
  // Enforce array boundary circular wrapping
  photoIndex = (index + currentProject.photos.length) % currentProject.photos.length;
  
  const modalImg = document.getElementById("modal-img");
  if (modalImg) {
    modalImg.src = currentProject.photos[photoIndex];
  }
  
  // Highlight currently viewing thumbnail
  const thumbs = document.getElementById("modal-thumbs").children;
  for (let i = 0; i < thumbs.length; i++) {
    if (i === photoIndex) {
      thumbs[i].classList.add("active");
    } else {
      thumbs[i].classList.remove("active");
    }
  }
}

// FIX: Added missing structural next/previous step handler
function movePhoto(step) {
  showPhoto(photoIndex + step);
}

// FIX: Added missing modal destruction state method
function closeProject() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("show");
  }
  currentProject = null;
}

// Global Keyboard Accessibility Override Escape key to exit overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProject();
  }
});

/* ---------- 4. PROJECT CARD AUTOMATED MINI-CAROUSELS ---------- */
const minis = document.querySelectorAll(".mini-carousel");
for (let m = 0; m < minis.length; m++) {
  buildMiniCarousel(minis[m]);
}

function buildMiniCarousel(box) {
  const projectKey = box.dataset.project;
  if (!projectPhotos[projectKey]) return;
  
  const photos = projectPhotos[projectKey].photos;
  let index = 0;

  // 1) Dynamic render tracks
  const miniTrack = document.createElement("div");
  miniTrack.className = "mini-track";
  for (let i = 0; i < photos.length; i++) {
    const img = document.createElement("img");
    img.src = photos[i];
    img.alt = "Project Preview Grid Component Element";
    miniTrack.appendChild(img);
  }
  box.appendChild(miniTrack);

  // 2) Navigation dots track builder
  const dots = document.createElement("div");
  dots.className = "mini-dots";
  for (let i = 0; i < photos.length; i++) {
    dots.appendChild(document.createElement("span"));
  }
  box.appendChild(dots);

  // 3) Arrows handling bounds isolation controls
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

/* ---------- 5. DEVELOPER TERMINAL TAB SWITCHER ---------- */
function switchTab(tabId) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Target matching elements structural selection mapping
  const clickedBtn = document.getElementById(`btn-${tabId}`) || Array.from(buttons).find(btn => btn.textContent.includes(tabId));
  if (clickedBtn) clickedBtn.classList.add('active');

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) targetContent.classList.add('active');
}

/* ---------- 6. HERO TYPEWRITER SIMULATION PIPELINE ---------- */
const phrases = ["Computer Engineer", "QA Automation Engineer", "Full-Stack Dev"];
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
    typeSpeed = 1500; // Complete word delay hold
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 400; // Next string sequence initiation pause delay
  }

  setTimeout(type, typeSpeed);
}

// Attach event system initializer
document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) type();
});