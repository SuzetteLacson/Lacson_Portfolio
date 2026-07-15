/* ==========================================================
   script.js — the small amount of JavaScript this site needs.
   Three jobs:
     1. the mobile hamburger menu
     2. the gallery carousel (arrows + dots + auto-play)
     3. the project photo popup (click a card → 4 photos)
========================================================== */

/* ---------- PROJECT PHOTOS (EDIT-ME!) ----------
   4 photos per project. Put your real pictures in the images
   folder and change the paths below. The name before the colon
   ('taskpilot' etc.) must match the onclick="openProject('...')"
   on each project card in index.html. */
const projectPhotos = {
  taskpilot: {
    title: "TaskPilot — Automation Dashboard",
    photos: [
      "images/project1.svg",
      "images/activity1.svg",
      "images/activity2.svg",
      "images/activity3.svg"
    ]
  },
  promptdesk: {
    title: "PromptDesk — AI Writing Helper",
    photos: [
      "images/project2.svg",
      "images/activity2.svg",
      "images/activity4.svg",
      "images/activity1.svg"
    ]
  },
  greensense: {
    title: "GreenSense — Arduino Plant Monitor",
    photos: [
      "images/project3.svg",
      "images/activity3.svg",
      "images/activity1.svg",
      "images/activity4.svg"
    ]
  }
};

/* ---------- 1. MOBILE MENU ----------
   The ☰ button calls this. It adds/removes the "open" class,
   and style.css shows the menu when "open" is present. */
function toggleMenu() {
  document.getElementById("navlinks").classList.toggle("open");
}

/* ---------- 2. CAROUSEL ---------- */

// Get the parts of the carousel from the page
const track  = document.getElementById("track");   // the row of slides
const slides = track.children;                     // every <figure class="slide">
const dotsBox = document.getElementById("dots");   // container for the dots

let current = 0;                                   // which slide is showing (0 = first)

// Create one dot button per slide, automatically
for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement("button");
  dot.onclick = function () { goToSlide(i); };     // clicking a dot jumps to that slide
  dotsBox.appendChild(dot);
}

// Jump directly to slide number n
function goToSlide(n) {
  current = n;
  // Slide the track left by n × 100%.
  // Example: slide 2 → translateX(-200%) → third photo is visible.
  track.style.transform = "translateX(-" + current * 100 + "%)";
  updateDots();
}

// Move one step: moveSlide(1) = next, moveSlide(-1) = previous
function moveSlide(step) {
  // The % (remainder) keeps the number inside 0..slides.length-1,
  // so after the last photo it loops back to the first.
  const n = (current + step + slides.length) % slides.length;
  goToSlide(n);
}

// Highlight the dot that matches the current slide
function updateDots() {
  for (let i = 0; i < dotsBox.children.length; i++) {
    if (i === current) {
      dotsBox.children[i].classList.add("active");
    } else {
      dotsBox.children[i].classList.remove("active");
    }
  }
}

// Auto-play: go to the next photo every 5 seconds
setInterval(function () { moveSlide(1); }, 5000);

// Show the first dot as active when the page loads
updateDots();

/* ---------- 3. PROJECT PHOTO POPUP ----------
   openProject('taskpilot') runs when you click a card.
   It looks up that project's title + 4 photos (from the
   projectPhotos list at the top) and fills the popup. */

let currentProject = null;   // which project is open
let photoIndex = 0;          // which of its photos is showing

function openProject(name) {
  currentProject = projectPhotos[name];
  photoIndex = 0;

  // set the popup title
  document.getElementById("modal-title").textContent = currentProject.title;

  // build the 4 thumbnails (one small img per photo)
  const thumbsBox = document.getElementById("modal-thumbs");
  thumbsBox.innerHTML = "";                    // clear old thumbnails
  for (let i = 0; i < currentProject.photos.length; i++) {
    const thumb = document.createElement("img");
    thumb.src = currentProject.photos[i];
    thumb.onclick = function () { showPhoto(i); };  // click thumb → jump to it
    thumbsBox.appendChild(thumb);
  }

  showPhoto(0);                                // start on the first photo
  document.getElementById("modal").classList.add("show");   // reveal popup
}

function closeProject() {
  document.getElementById("modal").classList.remove("show");
}

// Display photo number n in the big image + highlight its thumbnail
function showPhoto(n) {
  photoIndex = n;
  document.getElementById("modal-img").src = currentProject.photos[n];

  const thumbs = document.getElementById("modal-thumbs").children;
  for (let i = 0; i < thumbs.length; i++) {
    if (i === n) {
      thumbs[i].classList.add("active");
    } else {
      thumbs[i].classList.remove("active");
    }
  }
}

// Arrow buttons inside the popup: movePhoto(1)=next, movePhoto(-1)=back
function movePhoto(step) {
  const total = currentProject.photos.length;
  const n = (photoIndex + step + total) % total;   // loops around
  showPhoto(n);
}

// Pressing the Esc key also closes the popup
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeProject();
  }
});

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
