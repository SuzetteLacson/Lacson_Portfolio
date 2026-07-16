/* ============================================================================
   script.annotated.js — STUDY COPY of script.js (fully commented)

   THIS IS A DUPLICATE FOR LEARNING. The real site runs on ../script.js.
   Every line of code below is identical to the original — only comments added.

   ------------------------------------------------------------------------
   WHAT JAVASCRIPT IS DOING HERE
   HTML = the structure. CSS = the appearance. JavaScript = the BEHAVIOUR:
   what happens when you click, scroll, hover or type.

   THE ONE PATTERN THAT EXPLAINS THIS WHOLE FILE:
     JavaScript almost never sets a colour, size or animation directly.
     It adds or removes a CSS CLASS, and CSS does the visual work.
   You'll see classList.toggle("active") and classList.add("visible") over and
   over. That separation is deliberate — it keeps all the design in one file, and
   means an animation can be re-timed without touching any JavaScript.
   (The two exceptions are marked in the comments below.)

   VOCABULARY YOU'LL NEED FOR THIS FILE:
     const / let      = declare a variable. const can't be REASSIGNED; let can.
     function         = a named, reusable block of instructions
     () => {}         = an "arrow function" — a shorter way to write a function,
                        usually one that's passed straight into something else
     DOM              = the browser's live, in-memory model of the page. JS reads
                        and changes the DOM, and the screen updates to match.
     event            = something that happened (a click, a scroll, a keypress)
     event listener   = "when THIS happens, run THAT function"
     callback         = a function you hand to something else to call back later

   THE 8 SECTIONS:
     1. Project data (photos + write-ups)
     2. Capsule nav (mobile dropdown + scrollspy + scroll-reveal)
     3. Gallery photo strip (tabs + expanding accordion + auto-cycle)
     4. Project detail modal (photo viewer + write-up renderer)
     5. Project card mini-carousels
     6. About terminal tab switcher
     7. Hero typewriter
     8. (Scroll-reveal actually lives inside section 2c)
============================================================================ */


/* ============================================================================
   1. PROJECT DATA

   THE MOST IMPORTANT IDEA IN THIS FILE — say this one out loud if you're asked
   to explain the architecture:

   Every project's photos AND every word of its write-up live in this ONE object.
   The project cards and the popup are BUILT FROM IT by JavaScript. That means:
     - adding a project = adding an entry here + one card in the HTML
     - you never write the popup's HTML by hand; the code generates it
     - the data and the display can never drift out of sync

   This is a small, hand-rolled version of what React/Vue do for a living:
   "data in one place, UI generated from the data" (often called data-driven UI).
============================================================================ */
const projectPhotos = {
  /* A JavaScript OBJECT: a collection of key/value pairs wrapped in { }.
     Think of it as a labelled container — you look things up by NAME, not by
     position: projectPhotos.mazebot, or projectPhotos["mazebot"].

     `const` here doesn't mean the contents are frozen. It means the NAME
     projectPhotos can't be pointed at something else. The object's insides can
     still be edited. A common misunderstanding worth getting right. */

  SUZENTINEL: {
    /* "SUZENTINEL" is the KEY. It must match the HTML exactly:
           onclick="openProject('SUZENTINEL')"
           <div class="mini-carousel" data-project="SUZENTINEL">
       JS keys are CASE-SENSITIVE, so 'suzentinel' would find nothing and the
       popup would silently do nothing at all. (Notice this key is ALL CAPS while
       the other two are lowercase — it works, but it's inconsistent.) */
    title: "SUZENTINEL — AI Vision System",   /* a STRING: text in quotes */
    story: [
      /* SQUARE BRACKETS = an ARRAY: an ordered LIST. Objects {} look things up by
         name; arrays [] hold things in order and count from 0.
         This is an array of paragraphs, and the code below loops over it to build
         one <p> per item — so adding a third paragraph needs no code change. */
      "SUZENTINEL started as a personal problem: I had no idea where my screen time actually went, and manual time-logging never lasted more than a week. So I decided to build something that would do the watching for me.",
      "I designed and developed an AI-powered computer vision system in Python that monitors user activity in real time, then feeds everything into a Flask web dashboard where the data actually makes sense. It ended up replacing my manual logs completely — real productivity insights, zero spreadsheet discipline required."
    ],
    tech: "Computer vision, real-time activity tracking, web dashboard",
    framework: "Flask",
    languages: "Python, HTML/CSS",
    features: [                                 /* another array — becomes the <li> bullets */
      "Real-time activity monitoring through computer vision",
      "Automatic screen-time tracking and session history",
      "Flask dashboard with live productivity insights",
      "Runs quietly in the background while you work"
    ],
    challenges: "Getting the vision pipeline to run continuously without eating the CPU was the hardest part. I had to tune how often frames get processed and keep the dashboard queries light, so the tool never slows down the machine it's supposed to be monitoring.",
    contribution: "Solo project — I designed the architecture, wrote the Python detection logic, and built the Flask dashboard end to end.",
    photos: [
      /* The photo list. IMPORTANT: index [0] — the first one — is also the image
         that shows on the project card, because the mini-carousel starts at 0. */
      "../images/project1.svg",
      "../images/activity1.svg",
      "../images/activity2.svg",
      "../images/activity3.svg"
      /* NOTE: paths are "../images/" in this STUDY COPY only, because this file sits
         one folder deeper. The real ../script.js uses "images/". Everything else on
         this line is unchanged.
         Also: these .svg files are placeholders awaiting real screenshots. */
    ]
    /* No comma after the last property — allowed, but a trailing one is legal too. */
  },   /* <- comma between entries, because these are items in one object */

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
      /* This project has REAL photos — the others are still placeholders. */
      "../images/mzebot_bot.jpg",
      "../images/mzebot_maze.jpg",
      "../images/me_w_bot.jpg",
      "../images/mzebotgrouppic.jpg"
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
      "../images/project3.svg",
      "../images/activity3.svg",
      "../images/activity1.svg",
      "../images/activity4.svg"
    ]
  }
};   /* the semicolon closes the `const projectPhotos = {...}` statement */


/* ============================================================================
   2. CAPSULE NAVIGATION
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* "DOMContentLoaded" = an event the browser fires once the HTML has been fully
     read and the page structure exists. Everything inside this block waits for
     that moment.
     WHY: if JS runs before the HTML exists, getElementById returns null and the
     code crashes. Since the <script> tag is already the last line of the HTML
     this is belt-and-braces, but it's a good habit and costs nothing.
     The `() => { ... }` is an arrow function — the callback to run when it fires. */

  /* --- 2a. mobile dropdown open/close --- */
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const menuCloseBtn  = document.getElementById("menuCloseBtn");
  const navDropdown   = document.getElementById("navDropdown");
  /* getElementById = find the ONE element with this id, and hand back a live
     reference to it. Storing it in a const means the page is only searched once
     rather than on every click — a small but real efficiency habit. */

  const dropdownPills = document.querySelectorAll(".dropdown-pill");
  /* querySelectorAll = find ALL elements matching a CSS SELECTOR (note the "." —
     it takes CSS syntax, unlike getElementById which takes a bare id).
     It returns a NodeList — a list you can loop over. Even if only one element
     matches, you still get a list. */

  if (menuToggleBtn && menuCloseBtn && navDropdown) {
    /* A DEFENSIVE GUARD. && = AND, so: "only continue if all three were found."
       If an id is missing or misspelled, getElementById returns null, and calling
       .addEventListener on null would throw an error — which would stop the ENTIRE
       script and silently break the gallery, modal and typewriter too. This guard
       makes the failure harmless instead of catastrophic. */

    menuToggleBtn.addEventListener("click", (e) => {
      /* addEventListener("click", fn) = "when this is clicked, run this function."
         The `e` parameter is the EVENT OBJECT — the browser passes it in
         automatically with details about what happened. */
      e.stopPropagation();
      /* IMPORTANT AND SUBTLE. Clicks BUBBLE: a click here also counts as a click on
         its parents, all the way up to <document>. And further down there's a
         document-wide listener that CLOSES the menu on any outside click.
         Without stopPropagation(), this click would open the menu and then
         immediately bubble up and close it. The menu would never appear.
         stopPropagation() = "this event stops here, don't tell my parents." */
      navDropdown.classList.add("show");
      /* THE PATTERN AGAIN: JS adds a class, CSS does the rest.
         style.css has `.nav-dropdown.show { display: block; }` — that's the reveal.
         The JS has no idea the menu is black or rounded, and doesn't need to. */
      menuToggleBtn.setAttribute("aria-expanded", "true");
      /* ACCESSIBILITY, not decoration. This is what a screen reader announces —
         "expanded" vs "collapsed". A sighted user sees the menu; a blind user is
         told by this attribute. Keeping it in sync is the developer's job. */
    });

    const closeMenu = () => {
      /* A named function stored in a const, so the SAME closing logic can be reused
         by three different triggers below. Write it once, use it three times —
         if the closing behaviour ever changes, there's only one place to edit. */
      navDropdown.classList.remove("show");
      menuToggleBtn.setAttribute("aria-expanded", "false");
    };

    menuCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();   /* same bubbling protection as above */
      closeMenu();
    });

    dropdownPills.forEach(pill => pill.addEventListener("click", closeMenu));
    /* .forEach = "do this for every item in the list." Reads as: for each pill,
       attach a click listener that runs closeMenu.
       WHY: tapping a nav link scrolls you down the page — leaving the menu hanging
       open over the content would be sloppy, so it closes itself.
       Note `closeMenu` with NO brackets: passing the function ITSELF to be called
       later. Writing closeMenu() would CALL it immediately and pass its result
       (undefined) instead — a classic beginner bug. */

    document.addEventListener("click", (e) => {
      /* "Click anywhere outside to close" — expected behaviour for any menu.
         The listener is on `document`, so it hears EVERY click on the page. */
      if (!navDropdown.contains(e.target) && e.target !== menuToggleBtn) {
        /* Decoding this condition:
             e.target             = the exact element that was actually clicked
             navDropdown.contains(e.target) = is that element inside the menu?
             !                    = NOT
             !==                  = "is not equal to"
           So: "if the click was NOT inside the menu, AND was NOT the ••• button
           itself, then close." The second half matters — without it, clicking •••
           would close the menu that the other listener just opened. */
        closeMenu();
      }
    });
  }

  /* --- 2b. SCROLLSPY: highlight the nav link of the section you're looking at --- */
  const navTargets = document.querySelectorAll("section[id], footer[id]");
  /* A CSS selector doing real work: "every <section> that HAS an id attribute,
     plus every <footer> that has one." The comma = OR.
     Requiring [id] is the point — a section with no id has no matching nav link,
     so there'd be nothing to highlight. */
  const allNavLinks = document.querySelectorAll("[data-section]");
  /* "every element that has a data-section attribute" — which catches BOTH the
     desktop links AND the mobile dropdown pills at once. That's why one loop can
     keep both menus in sync, and why those attributes were put in the HTML. */

  if ("IntersectionObserver" in window && navTargets.length) {
    /* Two guards:
         "IntersectionObserver" in window  = does this browser support the feature?
                                             (`window` is the browser itself; `in`
                                             checks whether a name exists on it.)
                                             This is called FEATURE DETECTION —
                                             ask what the browser can do, rather
                                             than guessing from its name.
         navTargets.length                 = did we actually find any sections?
                                             0 is "falsy" in JS, so an empty list
                                             fails this check naturally. */

    const spy = new IntersectionObserver((entries) => {
      /* INTERSECTION OBSERVER — the modern way to react to scrolling, and the
         thing to name if you're asked how the scroll effects work.
         THE OLD WAY was listening to every scroll event and doing maths on every
         element — that fires hundreds of times a second and makes pages janky.
         THIS WAY, you tell the browser "watch these elements and tell me when they
         cross into view." The browser handles it natively and efficiently, and
         calls your function only when something actually changes.
         `entries` = the list of elements whose visibility just changed. */
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        /* isIntersecting = is it currently inside the watched zone?
           `return` = leave this function early. This is a GUARD CLAUSE: bail out on
           the case you don't care about (a section LEAVING view), so the rest of
           the code doesn't need to be wrapped in an if-block. Very common style. */
        const id = entry.target.id;
        /* entry.target = the actual element that came into view. Grab its id —
           e.g. "projects". */
        allNavLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === id);
          /* THE HEART OF THE SCROLLSPY, and a genuinely elegant line.
             classList.toggle(name, condition) — with a SECOND argument, toggle
             stops flip-flopping and becomes: "add the class if the condition is
             true, remove it if false."
             link.dataset.section reads the data-section="..." attribute from the
             HTML. (Any data-whatever becomes dataset.whatever — that's the whole
             API.)
             === is a STRICT equality check (compares value AND type; always prefer
             it over ==, which does surprising type conversions).
             So for every link: "are you the link for the section now on screen?
             If yes wear .active, if no take it off." One line loops over all the
             links and lands the highlight on exactly one of them. CSS then paints
             .nav-link.active yellow. */
        });
      });
    }, {
      /* The observer's OPTIONS object — the second argument, defining the zone. */
      rootMargin: "-40% 0px -55% 0px"
      /* rootMargin SHRINKS (negative) or grows (positive) the viewport box the
         observer watches. Order is top, right, bottom, left — same as CSS.
         -40% off the top and -55% off the bottom leaves a thin horizontal BAND
         across the middle 5% of the screen. So a section counts as "current" only
         when it crosses the middle — not the instant its first pixel appears.
         That's what makes the highlight feel right instead of jumping early.
         Tuning these two numbers changes exactly when the pill moves. */
    });

    navTargets.forEach(sec => spy.observe(sec));
    /* Creating an observer doesn't watch anything by itself — you must .observe()
       each element. This loop registers every section. */

    window.addEventListener("scroll", () => {
      /* AN EDGE-CASE FIX, and a good example of real-world problem solving.
         THE BUG: the footer is short. When you scroll to the very bottom, the page
         stops — and the footer may never reach that middle band. So the "Contact"
         link would never light up, no matter how far you scrolled.
         THE FIX: separately detect "am I at the bottom?" and force it. */
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      /* The maths, piece by piece:
           window.innerHeight    = how tall the visible window is
           window.scrollY        = how far down the page you've scrolled
           adding them           = the page position of the BOTTOM of your screen
           document.body.scrollHeight = the total height of the whole page
         When those are equal, you're at the bottom. The "- 2" is a 2px TOLERANCE:
         browsers round these numbers slightly differently and the values may never
         land exactly equal, so a couple of pixels of slack makes it reliable.
         Small tolerances like this are everywhere in real code. */
      if (atBottom) {
        allNavLinks.forEach(link => {
          link.classList.toggle("active", link.dataset.section === "contact");
          /* The same toggle line as the scrollspy, but the target is hard-coded to
             "contact" instead of read from the observer. */
        });
      }
    }, { passive: true });
    /* { passive: true } is a PERFORMANCE PROMISE to the browser: "this listener
       will never call preventDefault(), so don't wait for me before scrolling."
       Without it, the browser must run this code BEFORE it can scroll, which can
       make touch scrolling feel sticky on a phone. Free win on any scroll or touch
       listener that doesn't block the default action. */
  }

  /* --- 2c. SCROLL-REVEAL: fade/slide elements in as they appear --- */
  const revealEls = document.querySelectorAll(".reveal");
  /* Every element the HTML marked with class="reveal" — about 20 of them. */

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealer = new IntersectionObserver((entries) => {
      /* A SECOND, separate observer. Why not reuse the first? Because it needs a
         totally different trigger zone: the scrollspy fires at the middle of the
         screen, this one fires as soon as an element peeks in. Different jobs,
         different observers — that's the right call. */
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          /* Again: JS adds a class, CSS runs the animation. style.css has
             .reveal { opacity: 0 } and .reveal.visible { opacity: 1 } with a
             transition between them. The JS decides WHEN; the CSS decides HOW. */
          revealer.unobserve(entry.target);
          /* STOP WATCHING THIS ELEMENT — it's done, it only animates once.
             Two reasons this line matters:
               1. Performance — no point watching 20 elements forever.
               2. Behaviour — without it, scrolling back up and down would keep
                  re-triggering, and things would flicker.
             Cleaning up listeners/observers you no longer need is a genuinely good
             habit to demonstrate. */
        }
      });
    }, { threshold: 0.15 });
    /* threshold: 0.15 = "fire when 15% of the element is visible." 0 would fire at
       the very first pixel (too eager — it starts before you can see it), 1 would
       wait for the whole thing (too late on tall elements). 15% is a judgement
       call that feels right. */

    revealEls.forEach(el => revealer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
    /* THE FALLBACK, and worth pointing out. If the browser is too old to support
       IntersectionObserver, this instantly marks everything visible.
       WHY IT'S ESSENTIAL: .reveal starts at opacity: 0. If the JS that reveals it
       never runs, the page would be permanently BLANK. So the fallback isn't
       polish — it's the difference between "no animation" and "no website".
       This is called GRACEFUL DEGRADATION: the effect is lost, the content isn't. */
  }
});   /* end of the DOMContentLoaded block */


/* ============================================================================
   3. GALLERY PHOTO STRIP (tabs + expanding accordion + auto-cycle)

   REMEMBER WHAT CSS IS DOING, because the JS looks too simple otherwise:
     .strip-item        { flex: 1;   }              -> a collapsed sliver
     .strip-item.active { flex: 3.5; }              -> the expanded photo
     .strip-item        { transition: flex 0.55s; } -> animates between them
   So ALL the JavaScript below does is decide WHICH photo wears .active. It never
   sets a width, never animates anything. CSS does 100% of the visual work.
============================================================================ */
const photoStrip  = document.getElementById("photoStrip");
const galleryTabs = document.querySelectorAll(".gallery-tab");

if (photoStrip) {
  /* Guard: only run the gallery code if the strip actually exists on the page.
     (Note this block is NOT inside DOMContentLoaded — it works because the
     <script> tag is the last line of the HTML, so the strip already exists.) */

  const allItems = Array.from(photoStrip.querySelectorAll(".strip-item"));
  /* querySelectorAll returns a NodeList, which is *almost* an array but lacks
     methods like .filter() and .indexOf(). Array.from() converts it into a real
     array so those can be used below. A very common little conversion. */

  let visibleItems = [];   /* `let`, not `const`, because this gets REASSIGNED
                              every time you switch tabs. Starts as an empty array. */
  let stripIndex = 0;      /* which visible photo is currently expanded (0 = first) */
  let stripHovered = false;/* is the mouse over the strip right now? Used to pause
                              the auto-cycle. A BOOLEAN: only true or false. */

  function setStripActive(n) {
    /* The single function that decides which photo is expanded. */
    if (!visibleItems.length) return;   /* guard: nothing visible, nothing to do */

    stripIndex = (n + visibleItems.length) % visibleItems.length;
    /* THE WRAP-AROUND TRICK. This exact line appears three times in this file, so
       it's worth taking apart properly.
       `%` is the MODULO operator = the REMAINDER after division. 7 % 3 = 1.
       Say there are 5 photos:
         n = 5 (past the end)  ->  (5 + 5) % 5 = 10 % 5 = 0  -> back to the first
         n = 2 (normal)        ->  (2 + 5) % 5 =  7 % 5 = 2  -> unchanged
         n = -1 (before start) -> (-1 + 5) % 5 =  4 % 5 = 4  -> jumps to the last
       So the number can NEVER be out of range — the list becomes a loop.
       WHY "+ visibleItems.length" FIRST? Because JS gives -1 % 5 = -1 (it keeps
       the sign), which would be a broken index. Adding the length first makes it
       positive before the modulo. That addition is the whole reason "‹" can wrap
       backwards to the last photo. */

    visibleItems.forEach((item, i) => {
      /* forEach can take a SECOND parameter: `i`, the item's position (0, 1, 2...). */
      item.classList.toggle("active", i === stripIndex);
      /* The same conditional-toggle line as the scrollspy: "are you the chosen
         one? Then wear .active, otherwise take it off." One pass over the list
         adds the class to exactly one photo and strips it from the rest — no need
         to remember which one was previously active. */
    });
  }

  function applyFilter(category) {
    /* Show only the photos belonging to one tab. */
    allItems.forEach(item => {
      item.classList.toggle("hidden", item.dataset.category !== category);
      /* Note the !== (NOT equal): add .hidden to everything that DOESN'T match.
         CSS's `.strip-item.hidden { display: none }` removes them from the layout
         completely — which is what lets the remaining flex items automatically
         re-share the row. The strip re-balances itself with no extra code. */
      item.classList.remove("active");   /* clear the old selection */
    });

    visibleItems = allItems.filter(item => !item.classList.contains("hidden"));
    /* .filter() builds a NEW array containing only the items that pass the test —
       here, the ones that are NOT hidden. This is why Array.from() was needed
       earlier. `visibleItems` is what all the index maths above counts against, so
       "photo 3" always means the 3rd VISIBLE photo, not the 3rd overall. */

    setStripActive(0);   /* expand the first photo of the newly-chosen tab */
  }

  allItems.forEach(item => {
    const activate = () => {
      const i = visibleItems.indexOf(item);
      /* .indexOf() = "what position is this item at?" It returns -1 if not found. */
      if (i !== -1) setStripActive(i);
      /* The -1 check matters: a hidden photo isn't in visibleItems, so this
         prevents acting on a photo from another tab. */
    };
    item.addEventListener("mouseenter", activate);  /* desktop: hover to expand */
    item.addEventListener("click",      activate);  /* mobile: tap to expand */
    item.addEventListener("focus",      activate);  /* keyboard: Tab to expand —
                                                       this is what makes the
                                                       tabindex="0" in the HTML
                                                       actually pay off */
    /* THREE input methods, ONE shared function. Mouse, touch and keyboard users all
       get the same experience. Supporting all three deliberately is exactly the
       kind of detail worth mentioning in a walkthrough.
       ("mouseenter" rather than "mouseover" on purpose: mouseover re-fires as you
       move between child elements, mouseenter fires once on entry.) */
  });

  galleryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      galleryTabs.forEach(t => {
        t.classList.toggle("active", t === tab);
        /* t === tab compares the ELEMENTS themselves — "is this tab the one that
           was clicked?" Same conditional-toggle pattern, third time. */
        t.setAttribute("aria-pressed", t === tab ? "true" : "false");
        /* The ? : is the TERNARY OPERATOR — a compact if/else that produces a value:
             condition ? valueIfTrue : valueIfFalse
           setAttribute needs the STRING "true"/"false", not a real boolean, which
           is why it's written this way.
           WHY BOTH LINES: .active is for the EYES (CSS colours it), aria-pressed is
           for the EARS (a screen reader announces "pressed"). Sighted users get the
           first, blind users get the second. Doing them together, in one place, is
           how they stay in sync. */
      });
      applyFilter(tab.dataset.filter);
      /* Read data-filter="arduino" off the clicked button and hand it to the
         filter. THIS is why the tabs need no JS changes when you add a category:
         the button carries its own instructions in the HTML. */
    });
  });

  photoStrip.addEventListener("mouseenter", () => { stripHovered = true; });
  photoStrip.addEventListener("mouseleave", () => { stripHovered = false; });
  /* Just flipping the flag. Its only job is pausing the auto-cycle below —
     yanking the photo away while someone is looking at it would be infuriating.
     Small courtesy, real usability. */

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    /* READING A CSS MEDIA QUERY FROM JAVASCRIPT. matchMedia lets JS ask the same
       question the CSS asks in @media, and .matches gives back true/false.
       WHY THIS IS HERE: style.css already switches off the transitions for
       reduced-motion users — but CSS cannot stop a JavaScript timer. Without this
       check the photos would still SWAP every 4.5s, just without the smooth
       animation, which is arguably worse. The accessibility promise needs both
       halves: CSS handles the animation, JS handles the timer.
       The `!` inverts it: "if the user has NOT asked for reduced motion..." */
    setInterval(() => {
      /* setInterval(fn, ms) = run this function forever, every X milliseconds.
         (Its cousin setTimeout runs ONCE after a delay — see the typewriter.) */
      if (!stripHovered) setStripActive(stripIndex + 1);
      /* Only advance if the mouse is away. stripIndex + 1 could run past the end —
         but setStripActive's modulo wraps it safely back to 0. That's the payoff
         of putting the wrap-around inside the function: every caller is protected
         and no caller has to think about it. */
    }, 4500);   /* 4500ms = 4.5 seconds. Change this number to re-pace the gallery. */
  }

  applyFilter("events");
  /* THE STARTUP LINE. Everything above only DEFINES behaviour; nothing has run
     yet. This kicks it off by showing the Events tab.
     "events" must match the tab that has class="active" in the HTML — those two
     are hand-synced, so if you change the default tab you must change both. */
}


/* ============================================================================
   4. PROJECT DETAIL MODAL
============================================================================ */
let currentProject = null;
/* Which project is open right now. `null` is a deliberate "nothing yet" value —
   it's how the code below can tell "no popup is open" apart from a real project.
   These two are at the top level (outside every function) so that openProject,
   showPhoto and movePhoto can all see and share them — that's called SHARED STATE. */
let photoIndex = 0;   /* which photo of that project you're looking at */

function openProject(name) {
  /* Called straight from the HTML: onclick="openProject('mazebot')" */

  currentProject = projectPhotos[name];
  /* SQUARE-BRACKET LOOKUP. projectPhotos.mazebot needs the name typed literally;
     projectPhotos[name] looks up whatever the VARIABLE holds. Since `name` isn't
     known until someone clicks, brackets are the only option here. This one line
     is the bridge between the HTML's onclick and the data object at the top. */

  if (!currentProject) return;
  /* THE TYPO GUARD. If the key doesn't exist, JS returns `undefined` — which is
     "falsy", so ! makes this true and the function bails out.
     Without this line, a misspelt key would crash on the next line and the popup
     would break. With it, nothing happens — safe, if silent. */

  photoIndex = 0;   /* always open on the first photo, not wherever you left off */

  document.getElementById("modal-title").textContent = currentProject.title;
  /* .textContent = set an element's text. Note it REPLACES what's there (the
     placeholder word "Project" in the HTML).
     textContent vs innerHTML matters: textContent treats everything as plain text,
     so if a title contained "<b>", it would show those characters rather than
     turning bold. That also makes it SAFER — text can never become code. */

  document.getElementById("modal-body").innerHTML = buildWriteUp(currentProject);
  /* innerHTML = set the element's HTML, and the browser PARSES it into real
     elements. That's needed here because buildWriteUp returns actual tags (<p>,
     <ul>, <dl>) that must become part of the page.
     THE RULE TO REMEMBER: only use innerHTML with content YOU control. Putting
     text from a user or an outside source into innerHTML is how XSS security holes
     happen, because a <script> tag in that text would run. Here every word comes
     from the projectPhotos object in this same file, so it's safe.
     This ONE line is what fills the entire write-up. */

  const thumbsBox = document.getElementById("modal-thumbs");
  thumbsBox.innerHTML = "";
  /* WIPE THE OLD THUMBNAILS FIRST. Miss this line and opening a second project
     would ADD its thumbnails below the first project's. Setting innerHTML to an
     empty string is the quick way to empty a container. */

  for (let i = 0; i < currentProject.photos.length; i++) {
    /* A CLASSIC FOR LOOP, read in three parts:
         let i = 0                  start counting at 0
         i < photos.length          keep going while i is less than the count
         i++                        add 1 each time round
       For 4 photos, i runs 0,1,2,3 — arrays are ZERO-INDEXED, which is why it's
       `< length` and not `<= length` (that would run one past the end). */
    const thumb = document.createElement("img");
    /* createElement makes a brand-new element in memory. It is NOT on the page yet
       — nothing appears until appendChild puts it there (three lines down). */
    thumb.src = currentProject.photos[i];   /* [i] = the i-th item of the array */
    thumb.alt = `${currentProject.title} thumbnail ${i + 1}`;
    /* BACKTICKS = a TEMPLATE LITERAL, and ${...} drops a value into the middle of
       the text. It's the readable alternative to "a " + b + " c".
       `i + 1` because humans count from 1 while arrays count from 0 — so photo [0]
       is announced as "thumbnail 1". A small, human detail.
       Note the alt text is generated too, so accessibility scales automatically
       with the data. */
    thumb.onclick = function () { showPhoto(i); };
    /* Attach a click handler to the new element. It CAPTURES `i` — each thumbnail
       remembers its own number, so thumbnail 3 always shows photo 3. (This works
       reliably because `i` is declared with `let`, which creates a fresh binding
       each loop. With the old `var`, every thumbnail would wrongly show the LAST
       photo — a legendary JavaScript gotcha, quietly avoided here.) */
    thumbsBox.appendChild(thumb);
    /* NOW it's added to the page and becomes visible. */
  }

  showPhoto(0);   /* load the first photo into the big viewer */
  document.getElementById("modal").classList.add("show");
  /* The reveal — CSS's .modal-overlay.show flips display:none to display:flex.
     Same pattern as everything else. */
  document.getElementById("modal-close-btn").focus();
  /* ACCESSIBILITY, and a genuinely thoughtful line. .focus() moves the keyboard
     cursor onto the Close button. Without it, a keyboard user's focus would still
     be back on the card BEHIND the popup — they'd be tabbing through an invisible
     page with no idea where they are. Moving focus INTO a dialog when it opens is
     standard modal practice. */
}

function buildWriteUp(p) {
  /* TURNS ONE PROJECT OBJECT INTO HTML. This function is the whole reason the
     write-ups never need to be written by hand.
     `p` is just a short parameter name for the project passed in. */

  const storyHTML    = p.story.map(par => `<p class="modal-story">${par}</p>`).join("");
  /* .map() + .join("") — THE key array combo for building HTML, worth learning:
       .map(fn)  = make a NEW array by transforming every item. Each story
                   paragraph becomes a string like '<p class="modal-story">...</p>'
       .join("") = glue an array into ONE string, with "" between items (no
                   separator). Without join you'd get commas between paragraphs.
     Result: however many paragraphs the data has, you get that many <p> tags.
     Add a 3rd paragraph to the data and it just appears — no code change. */

  const featuresHTML = p.features.map(f => `<li>${f}</li>`).join("");
  /* Exactly the same technique for the bullet list. */

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
  /* A MULTI-LINE TEMPLATE LITERAL. Backticks (unlike quotes) let a string span
     several lines, so the HTML can be laid out readably instead of as one endless
     line. Each ${...} injects a value from the project data.
     <dl>/<dt>/<dd> = description list / term / definition — the semantically
     correct tags for label-value pairs like "Framework: Flask".
     `return` hands this finished string back to openProject, which drops it into
     the page with innerHTML. Note the "// " before each heading isn't here — CSS
     adds it, via .modal-body h4::before. Presentation stays in CSS. */
}

function showPhoto(index) {
  if (!currentProject) return;   /* guard: nothing open, nothing to show */

  photoIndex = (index + currentProject.photos.length) % currentProject.photos.length;
  /* THE SAME WRAP-AROUND MODULO as the gallery. This is what lets ‹ and › run
     forever without ever hitting the end of the array — go past the last photo and
     you land on the first; go back from the first and you land on the last. */

  const modalImg = document.getElementById("modal-img");
  modalImg.src = currentProject.photos[photoIndex];
  /* Changing .src swaps the image. Recall the HTML's <img id="modal-img"> has NO
     src at all — this line is where it always comes from. */
  modalImg.alt = `${currentProject.title} — photo ${photoIndex + 1}`;
  /* Update the alt text TOO, not just the src. Easy to forget, and forgetting it
     means a screen-reader user is told the wrong photo. */

  const thumbs = document.getElementById("modal-thumbs").children;
  /* .children = the live list of elements inside — the thumbnails built earlier. */
  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.toggle("active", i === photoIndex);
    /* The conditional-toggle pattern one final time: highlight the thumbnail you're
       viewing, un-highlight the rest. CSS fades the inactive ones to opacity 0.5. */
  }
}

function movePhoto(step) {
  showPhoto(photoIndex + step);
  /* Called from the HTML as movePhoto(-1) and movePhoto(1).
     ONE function, direction passed as a number, instead of separate next/prev
     functions. It adds the step to the current index and lets showPhoto's modulo
     handle any wrap-around. Three lines total for a fully looping carousel —
     a nice example of letting one small function do the hard part. */
}

function closeProject() {
  document.getElementById("modal").classList.remove("show");
  /* Removing .show sends CSS back to display:none. */
  currentProject = null;
  /* Reset the shared state. This is what makes the `if (!currentProject) return;`
     guards in showPhoto/movePhoto work — a stray keypress after closing now hits
     that guard and does nothing instead of acting on a stale project. */
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProject();
  /* "keydown" fires for ANY key anywhere on the page; e.key is the key's name as a
     string. Esc-to-close is a universal convention — users expect it without being
     told, so leaving it out feels broken.
     Combined with the ✕ button and the click-outside handler, that's THREE ways to
     close the popup. Never trap someone in a dialog.
     (It runs harmlessly when nothing is open: closeProject just removes a class
     that isn't there.) */
});


/* ============================================================================
   5. PROJECT CARD MINI-CAROUSELS

   HOW THE SLIDING WORKS (the "key line" of the whole project — if you only
   memorise one mechanism, make it this one):
     - all the photos sit in ONE long flex row (.mini-track)
     - the box around it has overflow: hidden, so only ONE photo is ever visible
     - JS slides the whole row sideways with transform: translateX(-100% per step)
   Photo 0 = 0%. Photo 1 = -100% (slide left by one full box). Photo 2 = -200%.
   That's the entire carousel.
============================================================================ */
const minis = document.querySelectorAll(".mini-carousel");
for (let m = 0; m < minis.length; m++) {
  buildMiniCarousel(minis[m]);
  /* Find every empty .mini-carousel div and build a slider inside it. Remember the
     HTML has <div class="mini-carousel" data-project="mazebot"></div> — completely
     EMPTY. Everything you see on a project card is created below.
     Also note: buildMiniCarousel is CALLED here on line ~1 but DEFINED below. That
     works because of HOISTING — JS reads all `function` declarations before it
     starts executing. (Variables declared with let/const are NOT hoisted this way,
     which is why this only works for functions.) */
}

function buildMiniCarousel(box) {
  const projectKey = box.dataset.project;
  /* Read data-project="mazebot" off the div — the same data-attribute bridge used
     by the gallery tabs and the scrollspy. */
  if (!projectPhotos[projectKey]) return;
  /* Guard: if that key isn't in the data, quietly do nothing rather than crash. */

  const photos = projectPhotos[projectKey].photos;
  let index = 0;
  /* `index` is declared INSIDE this function, so each carousel gets its very own.
     Three cards = three independent `index` variables that can't interfere with
     each other. That's SCOPE doing useful work — and it's why the three carousels
     can run on different photos at the same time. */

  /* 1) the sliding photo track */
  const miniTrack = document.createElement("div");
  miniTrack.className = "mini-track";
  /* .className sets the class, which is how the new div picks up all its styling
     (display:flex, the transition) from style.css. JS creates the element; CSS
     still owns how it looks. */
  for (let i = 0; i < photos.length; i++) {
    const img = document.createElement("img");
    img.src = photos[i];
    img.alt = projectPhotos[projectKey].title + " — photo " + (i + 1);
    /* Built with + string concatenation here, while openProject used backticks for
       the same job. Both work; the backtick version is easier to read. A small
       inconsistency in the original — worth noticing, not worth worrying about. */
    img.loading = "lazy";
    /* Sets the loading="lazy" attribute from JS — don't download this image until
       it's near the viewport. Since these elements are created by script rather
       than written in the HTML, it has to be set here. */
    miniTrack.appendChild(img);
  }
  box.appendChild(miniTrack);
  /* NOTE THE ORDER: all the images are appended to miniTrack while it's still off
     the page, and only THEN is the finished track added to the document. Touching
     the live page once instead of four times is cheaper for the browser — building
     first and inserting once is a good habit. */

  /* 2) the little dots */
  const dots = document.createElement("div");
  dots.className = "mini-dots";
  for (let i = 0; i < photos.length; i++) {
    dots.appendChild(document.createElement("span"));
    /* An empty <span> per photo. They have no content — CSS gives them their
       8x8 size, border and background. Create and append in one line. */
  }
  box.appendChild(dots);

  /* 3) prev/next arrows */
  const prev = document.createElement("button");
  prev.className = "mini-btn prev";   /* TWO classes in one string: shared look
                                         (.mini-btn) + position modifier (.prev) */
  prev.textContent = "‹";
  prev.setAttribute("aria-label", "Previous photo");
  /* The button's visible text is just "‹", which a screen reader can't make sense
     of. aria-label gives it a real spoken name. Any icon-only button needs one. */
  prev.onclick = function (e) { e.stopPropagation(); show(index - 1); };
  /* e.stopPropagation() IS ESSENTIAL HERE. The arrow sits INSIDE the project card,
     and the card has onclick="openProject(...)". Without this line, clicking "next
     photo" would ALSO open the popup — because the click bubbles up to the card.
     stopPropagation keeps the click local. (Exactly the same fix as the modal box
     and the nav toggle — three different bugs, one concept.) */
  box.appendChild(prev);

  const next = document.createElement("button");
  next.className = "mini-btn next";
  next.textContent = "›";
  next.setAttribute("aria-label", "Next photo");
  next.onclick = function (e) { e.stopPropagation(); show(index + 1); };
  box.appendChild(next);

  function show(n) {
    /* A function INSIDE a function. This is a CLOSURE: `show` can still see
       `index`, `photos`, `miniTrack` and `dots` from the function around it, even
       when it runs later from a click. Each carousel's `show` is permanently
       wired to its own set of variables — which is exactly why three carousels
       don't tread on each other. Closures are a genuinely important JS concept and
       this is a clean, real example of one. */
    index = (n + photos.length) % photos.length;   /* the wrap-around modulo again */

    miniTrack.style.transform = "translateX(-" + index * 100 + "%)";
    /* ***THE KEY LINE OF THE ENTIRE PROJECT*** — the one to have ready if you're
       asked to explain a piece of your own code.
         index 0 -> "translateX(-0%)"    the first photo sits in the window
         index 1 -> "translateX(-100%)"  slide the row left by one full box width
         index 2 -> "translateX(-200%)"  by two
       The row moves; the window (overflow: hidden) stays still. That's it.
       And because style.css has `.mini-track { transition: transform 0.4s ease; }`,
       the jump becomes a smooth SLIDE for free — the JS never animates anything,
       it just sets the destination.

       This is also one of only TWO places in this file where JS sets a style
       directly rather than toggling a class. It's justified: the value is
       calculated from data (index * 100) and can't be predicted in a stylesheet. */

    for (let i = 0; i < dots.children.length; i++) {
      dots.children[i].className = (i === index) ? "active" : "";
      /* The ternary again: the current dot gets class="active", the rest get "".
         CAREFUL: .className REPLACES all classes, unlike classList.add which adds
         one. It's safe here only because these spans have no other classes. As a
         rule, classList.toggle("active", i === index) is the sturdier way — the
         same thing the rest of this file uses. Another honest "what would I
         improve?" answer. */
    }
  }

  show(0);   /* start on the first photo — this is also what puts the card's cover
                image in place, since nothing is visible until show() runs once */
  setInterval(function () { show(index + 1); }, 4000);
  /* Auto-advance every 4 seconds, forever. index + 1 can overflow past the end and
     the modulo inside show() wraps it — the caller never has to care.
     HONEST OBSERVATION FOR YOUR REPORT: unlike the gallery strip, this one does
     NOT check prefers-reduced-motion and does NOT pause on hover. It's a small
     inconsistency in the original code — the kind of thing a good code review
     would flag. Being able to point at it yourself looks better than being told. */
}


/* ============================================================================
   6. ABOUT TERMINAL TAB SWITCHER
============================================================================ */
function switchTab(tabId) {
  /* Called from the HTML: onclick="switchTab('profile')" */

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  /* THE STRATEGY: turn EVERYTHING off first, then turn ONE thing on. It's simpler
     and more reliable than tracking which tab was previously active and removing
     the class from just that one — there's no state to get out of sync. A good
     habit for any "one of many" selection. */

  const clickedBtn = document.getElementById(`btn-${tabId}`);
  /* BUILDING AN ID FROM A STRING with a template literal: tabId "profile" becomes
     "btn-profile". This is why the HTML's ids follow that strict naming convention
     — the code DEPENDS on it. Add a tab called 'skills' and you must name its
     button id="btn-skills" and its panel id="tab-skills", or this finds nothing. */
  if (clickedBtn) clickedBtn.classList.add("active");
  /* The `if` guards against a typo'd id returning null. */

  const targetContent = document.getElementById(`tab-${tabId}`);
  if (targetContent) targetContent.classList.add("active");
  /* And CSS does the rest: .tab-content { display: none } hides all panels,
     .tab-content.active { display: block } shows this one. Nothing is created or
     destroyed — both panels are always in the HTML. Toggling one class is the
     whole tab system. */
}


/* ============================================================================
   7. HERO TYPEWRITER — the rotating job titles under the big name
============================================================================ */
const phrases = ["Computer Engineering Student", "QA Automation", "Arduino & Hardware Tinkerer", "Aspiring App Developer"];
/* The rotation list. Add or edit a string and the typewriter picks it up — the
   code below never assumes how many there are. */

let phraseIndex = 0;   /* which phrase we're on */
let charIndex = 0;     /* how many letters of it are currently shown */
let isDeleting = false;/* are we typing forwards or erasing backwards? */
/* These four variables are the entire "memory" of the animation. Together they
   describe the exact state at any instant — this is a tiny STATE MACHINE. */

const typewriterElement = document.getElementById("typewriter");
/* The empty <span id="typewriter"></span> from the HTML. */

function type() {
  /* THE CLEVER BIT: this function does ONE tiny step (add or remove a single
     letter) and then schedules ITSELF to run again. It never loops. Every call
     handles exactly one frame of the animation. */
  if (!typewriterElement) return;   /* guard */

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;   /* one letter SHORTER each time */
  } else {
    typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;   /* one letter LONGER each time */
  }
  /* .substring(0, n) = "give me the first n characters."
     So typing isn't done letter by letter at all — the code re-writes the WHOLE
     text every step, just with a different length. "Comp" -> "Compu" -> "Comput".
     Simpler than appending, and it works identically in reverse for deleting.
     This is the other of the two places JS writes content directly rather than
     toggling a class — unavoidable, since the text itself is what's changing.
     (`charIndex++` is shorthand for `charIndex = charIndex + 1`.) */

  let typeSpeed = isDeleting ? 40 : 80;
  /* The ternary again: deleting runs at 40ms per letter, typing at 80ms.
     WHY: real typing is slower than backspacing, and matching that makes it feel
     human. A constant speed reads as robotic. `let`, not const, because the two
     branches below overwrite it. */

  if (!isDeleting && charIndex === currentPhrase.length) {
    /* Finished typing the whole phrase. */
    typeSpeed = 1500;    /* PAUSE 1.5s so it can actually be read before erasing */
    isDeleting = true;   /* flip into delete mode for the next call */
  } else if (isDeleting && charIndex === 0) {
    /* Finished erasing back to nothing. */
    isDeleting = false;                              /* back to typing mode */
    phraseIndex = (phraseIndex + 1) % phrases.length;
    /* THE MODULO WRAP-AROUND, one last time — after the last phrase it returns to
       0 and the cycle restarts forever. Same trick as both carousels. It's also
       why you can add a 5th phrase without touching this line. */
    typeSpeed = 400;     /* a short beat before the next word starts */
  }
  /* Those two ifs are the only "decisions" in the animation. The rest is just
     adding or removing one letter. */

  setTimeout(type, typeSpeed);
  /* THE ENGINE. setTimeout(fn, ms) = run this ONCE after a delay. Here `type`
     schedules ITSELF — a pattern called RECURSION (a function calling itself),
     and it runs forever.
     WHY NOT setInterval? Because the delay CHANGES every step: 80ms while typing,
     40ms while deleting, 1500ms at the pause. setInterval is locked to one fixed
     rate; setTimeout lets each step choose its own. That variable timing is the
     whole reason the effect feels alive.
     Note `type` with no brackets — pass the function, don't call it. */
}

document.addEventListener("DOMContentLoaded", () => {
  if (typewriterElement) type();
  /* THE STARTING PISTOL. Call type() exactly ONCE, and its own setTimeout keeps
     it going indefinitely. Wrapped in DOMContentLoaded so the span is guaranteed
     to exist, and guarded so a missing element can't crash the script.
     (This is a second DOMContentLoaded listener — the nav registered one earlier.
     That's perfectly fine: you can add as many listeners for the same event as you
     like, and they all run.) */
});

/* ============================================================================
   END OF FILE — the recap:

   THE PATTERN, one more time: JS toggles a class -> CSS does the visuals.
   Two deliberate exceptions: the carousel's translateX (a calculated value) and
   the typewriter's textContent (the text itself is the thing changing).

   THE CONCEPTS WORTH NAMING IF YOU'RE ASKED:
     - data-driven UI      one projectPhotos object; the cards and popup are
                           generated from it (a hand-rolled hint of what React does)
     - IntersectionObserver the modern, efficient way to react to scrolling —
                           powers both the scrollspy and the scroll-reveal
     - data-* attributes   the bridge between HTML and JS (data-section,
                           data-category, data-filter, data-project)
     - the modulo wrap     (n + len) % len makes any list circular — used by both
                           carousels and the typewriter
     - event bubbling      and stopPropagation() to contain a click — the fix that
                           makes the modal, the nav and the card arrows all work
     - closures            each mini-carousel keeps its own private `index`
     - feature detection   check the browser can do something before using it, and
                           degrade gracefully if not
     - accessibility       aria-labels, aria-expanded/pressed kept in sync, focus
                           moved into the dialog, Esc to close, keyboard-triggered
                           gallery, and prefers-reduced-motion honoured in BOTH
                           CSS and JS

   NO FRAMEWORK. NO LIBRARY. NO BUILD STEP. Every line above is plain browser
   JavaScript that runs as-is when the file is opened.
============================================================================ */
