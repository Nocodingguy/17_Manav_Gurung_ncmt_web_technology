/*
 PIXEL CURSOR Learned from youtube
   Replaces the default mouse cursor with a custom  */            
const pixelCanvas = document.getElementById('pixel-cursor');
const ctx = pixelCanvas.getContext('2d');

const SCALE = 2; // each logical pixel = 2×2 real pixels

// Classic pixel arrow cursor (16 rows × 16 cols)
const CURSOR_MAP = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0],
  [1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0],
  [1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0],
  [1,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0],
  [1,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
  [1,2,2,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [1,2,1,0,1,2,2,1,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0],
  [1,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
];

// Draws the cursor onto the canvas
// clicking = true makes the black pixels slightly grey
function drawCursor(clicking = false) {
  ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  for (let row = 0; row < CURSOR_MAP.length; row++) {
    for (let col = 0; col < CURSOR_MAP[row].length; col++) {
      const val = CURSOR_MAP[row][col];
      if (val === 0) continue;                     // skip transparent
      ctx.fillStyle = val === 1
        ? (clicking ? '#555' : '#c8f03c')          // black / clicked
        : 'rgba(255,255,255,0.6)';                 // white outline
      ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
    }
  }
}

drawCursor(); // draw once on page load

// Move the canvas to follow the mouse
document.addEventListener('mousemove', e => {
  pixelCanvas.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Visual feedback when clicking
document.addEventListener('mousedown', () => drawCursor(true));
document.addEventListener('mouseup',   () => drawCursor(false));


/* 
 SCROLL REVEAL (IntersectionObserver)
   Any element with class="reveal" starts hidden
   (opacity:0, translateY:28px — set in CSS).
   IntersectionObserver watches every .reveal element.
   When one enters the viewport (threshold: 12% visible),
   we add the class "visible" which triggers the CSS
   transition to animate it in. We then unobserve it
   so it won't re-trigger.
 */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  { threshold: 0.12 } // trigger when 12% of element is visible
);

revealEls.forEach(el => revealObserver.observe(el));


/*
 PROJECT CARD SCROLL — ARROW BUTTONS
   Clicking the ← → arrow buttons scrolls the
   .projects-track container left or right by 680px
   using smooth scroll behavior (scrollBy).
 */
const track     = document.getElementById('projectsTrack');
const btnLeft   = document.getElementById('scrollLeft');
const btnRight  = document.getElementById('scrollRight');

btnLeft.addEventListener('click', () => {
  track.scrollBy({ left: -680, behavior: 'smooth' });
});

btnRight.addEventListener('click', () => {
  track.scrollBy({ left: 680, behavior: 'smooth' });
});


/* ================================================
   PROJECTS SECTION — 
   ================================================ */

(function () {
  const cards   = document.querySelectorAll('.project-card');
  const dots    = document.querySelectorAll('.dot');
  const fill    = document.getElementById('progressFill');
  const btnPrev = document.getElementById('scrollLeft');
  const btnNext = document.getElementById('scrollRight');

  let current = 0;
  const total = cards.length;

  /**
   * Navigate to a specific card index.
   * @param {number} index - Target card index
   * @param {'left'|'right'} dir - Slide direction for animation
   */
  function goTo(index, dir = 'right') {
    // Deactivate current card and dot
    cards[current].classList.remove('active', 'slide-left');
    dots[current].classList.remove('active');

    // Wrap around
    current = ((index % total) + total) % total;

    // Activate new card with correct animation direction
    cards[current].classList.remove('slide-left');
    if (dir === 'left') cards[current].classList.add('slide-left');
    cards[current].classList.add('active');

    // Update dot
    dots[current].classList.add('active');

    // Update progress bar
    fill.style.width = ((current + 1) / total * 100) + '%';
  }

  // ── Arrow buttons ──
  btnNext.addEventListener('click', () => goTo(current + 1, 'right'));
  btnPrev.addEventListener('click', () => goTo(current - 1, 'left'));

  // ── Dot clicks ──
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.i, 10);
      if (i !== current) goTo(i, i > current ? 'right' : 'left');
    });
  });

  // ── Keyboard arrow keys ──
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1, 'right');
    if (e.key === 'ArrowLeft')  goTo(current - 1, 'left');
  });

  // ── Touch / swipe support ──
  let touchStartX = 0;
  const track = document.getElementById('projectsTrack');

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1, 'right') : goTo(current - 1, 'left');
    }
  }, { passive: true });

})();


/*
CONTACT FORM SUBMISSION FEEDBACK
   Intercepts the default form submit (which would
   reload the page). Instead we show a success state
   on the button, then reset everything after 2.5s.

   e.preventDefault() stops the real form submit.
 */
const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', async e => {
  e.preventDefault();

  sendBtn.textContent = 'Sending...';

  const data = new FormData(form);
  const res = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (res.ok) {
    // Show success state
    sendBtn.textContent         = 'Message Sent ✓';
    sendBtn.style.background    = '#2ecc71';
    sendBtn.style.letterSpacing = '0.18em';

    // Reset after 2.5 seconds
    setTimeout(() => {
      sendBtn.textContent         = 'Send Message →';
      sendBtn.style.background    = '';
      sendBtn.style.letterSpacing = '';
      form.reset();
    }, 2500);

  } else {
    sendBtn.textContent = 'Failed — Try Again';
    sendBtn.style.background = '#e74c3c';
  }
});

/* NAVBAR SCROLL SHADOW
   Adds a subtle bottom shadow to the navbar when the
   user scrolls down, to visually separate it from
   the page content. Removes it when back at the top.
 */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});


/* animation for archive which helps users swap to back card using cycle method*/
 document.querySelectorAll('.stack-group').forEach(group => {
  group.addEventListener('click', () => {
    const front = group.querySelector('.front');
    const back1 = group.querySelector('.back-1');
    const back2 = group.querySelector('.back-2');

    front.classList.replace('front', 'back-2');
    back1.classList.replace('back-1', 'front');
    back2.classList.replace('back-2', 'back-1');
  });
});

