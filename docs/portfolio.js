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


/* 
PROJECT CARD SCROLL — CLICK & DRAG
   Lets the user click and drag the project track
   horizontally on desktop like a touch device.
   HOW IT WORKS:
   - mousedown: records the starting X position and
     saves the current scrollLeft value.
   - mousemove: while the button is held, calculates
     how far the mouse has moved and sets scrollLeft
     accordingly (× 1.5 for a natural feel).
   - mouseup / mouseleave: stops dragging.
    */
let isDragging   = false;
let dragStartX   = 0;
let dragScrollLeft = 0;

track.addEventListener('mousedown', e => {
  isDragging     = true;
  dragStartX     = e.pageX - track.offsetLeft;
  dragScrollLeft = track.scrollLeft;
});

track.addEventListener('mouseleave', () => { isDragging = false; });
track.addEventListener('mouseup',    () => { isDragging = false; });

track.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x    = e.pageX - track.offsetLeft;
  const dist = (x - dragStartX) * 1.5;  // 1.5× multiplier = natural feel
  track.scrollLeft = dragScrollLeft - dist;
});


/*
CONTACT FORM SUBMISSION FEEDBACK
   Intercepts the default form submit (which would
   reload the page). Instead we show a success state
   on the button, then reset everything after 2.5s.

   e.preventDefault() stops the real form submit.
 */
const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', e => {
  e.preventDefault(); // stop page reload

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