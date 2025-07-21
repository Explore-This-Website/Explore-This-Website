const chickenBall = document.getElementById('chickenBall');
const piadoContainer = document.getElementById('piadoContainer');
const piadoBalloon = document.getElementById('piadoBalloon');

let posX = 25, posY = 25;
let speedX = 3, speedY = 3;
let isDragging = false;
let offsetX = 0, offsetY = 0;

const piados = Array.from(piadoContainer.querySelectorAll('p')).map(p => p.textContent);
let shuffledPiados = shuffle([...piados]);
let currentPiadoIndex = 0;

const audio = new Audio('chicken/galinha.mp3');
audio.preload = 'auto';

// Play the chicken sound from the start
function playSound() {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// Shuffle array elements using Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Retrieve the next piado text, reshuffle when all have been used
function getNextPiado() {
  const text = shuffledPiados[currentPiadoIndex];
  currentPiadoIndex++;
  if (currentPiadoIndex >= shuffledPiados.length) {
    currentPiadoIndex = 0;
    shuffledPiados = shuffle([...piados]);
  }
  return text;
}

let balloonVisible = false;
let balloonTimeout = null;

// Display the piado balloon with fade-in and fade-out after 2 seconds
function showPiado(text) {
  piadoBalloon.textContent = text;
  piadoBalloon.style.opacity = '1';
  balloonVisible = true;

  clearTimeout(balloonTimeout);
  balloonTimeout = setTimeout(() => {
    piadoBalloon.style.opacity = '0';
    balloonVisible = false;
  }, 2000);

  updateBalloonPosition();
}

// Position the piado balloon relative to the chicken ball, flipping side near edges
function updateBalloonPosition() {
  if (!balloonVisible) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const balloonRect = piadoBalloon.getBoundingClientRect();
  const ballRect = chickenBall.getBoundingClientRect();

  let direction = 'right';
  const distanceToRightEdge = screenWidth - (posX + ballRect.width);
  const distanceToLeftEdge = posX;

  if (distanceToRightEdge < balloonRect.width + 20 && distanceToLeftEdge > balloonRect.width + 20) {
    direction = 'left';
  }

  // Vertically center the balloon relative to the chicken ball, constrained to viewport
  let top = posY + (ballRect.height / 2) - (balloonRect.height / 2);
  top = Math.max(5, Math.min(top, screenHeight - balloonRect.height - 5));

  let left;
  if (direction === 'left') {
    left = posX - balloonRect.width - 10;
  } else {
    left = posX + ballRect.width + 10;
  }

  piadoBalloon.style.top = `${top}px`;
  piadoBalloon.style.left = `${left}px`;
}

// Update chicken ball position in the DOM and reposition balloon
function updatePosition() {
  chickenBall.style.left = `${posX}px`;
  chickenBall.style.top = `${posY}px`;
  updateBalloonPosition();
}

// Animate the chicken ball movement with boundary collision detection
function moveChickenBall() {
  if (isDragging) {
    // Skip movement while dragging
    requestAnimationFrame(moveChickenBall);
    return;
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const ballWidth = chickenBall.offsetWidth;
  const ballHeight = chickenBall.offsetHeight;

  posX += speedX;
  posY += speedY;

  let bounced = false;

  if (posX + ballWidth >= screenWidth) {
    posX = screenWidth - ballWidth;
    speedX = -speedX;
    bounced = true;
  } else if (posX <= 0) {
    posX = 0;
    speedX = -speedX;
    bounced = true;
  }

  if (posY + ballHeight >= screenHeight) {
    posY = screenHeight - ballHeight;
    speedY = -speedY;
    bounced = true;
  } else if (posY <= 0) {
    posY = 0;
    speedY = -speedY;
    bounced = true;
  }

  updatePosition();

  if (bounced) {

    if (Math.random() < 0.2) { // Giving this a 20% chance just to reduce spamming
      showPiado(getNextPiado());
      playSound();
    }

  }

  requestAnimationFrame(moveChickenBall);
}

// Mouse down event starts dragging and triggers sound and piado display
chickenBall.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - chickenBall.getBoundingClientRect().left;
  offsetY = e.clientY - chickenBall.getBoundingClientRect().top;
  chickenBall.style.cursor = 'grabbing';

  playSound();
  showPiado(getNextPiado());

  e.preventDefault(); // Prevent text selection during drag
});

// Update position while dragging, constrained within viewport
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const ballWidth = chickenBall.offsetWidth;
  const ballHeight = chickenBall.offsetHeight;

  posX = e.clientX - offsetX;
  posY = e.clientY - offsetY;

  posX = Math.max(0, Math.min(posX, screenWidth - ballWidth));
  posY = Math.max(0, Math.min(posY, screenHeight - ballHeight));

  updatePosition();
});

// Mouse up event ends dragging and resets cursor style
document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    chickenBall.style.cursor = 'grab';
  }
});

// Clicking the chicken ball also triggers sound and piado display
chickenBall.addEventListener('click', () => {
  playSound();
  showPiado(getNextPiado());
});

// Adjust chicken ball position on window resize to keep it inside viewport
window.addEventListener('resize', () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const ballWidth = chickenBall.offsetWidth;
  const ballHeight = chickenBall.offsetHeight;

  posX = Math.max(0, Math.min(posX, screenWidth - ballWidth));
  posY = Math.max(0, Math.min(posY, screenHeight - ballHeight));

  updatePosition();
});

// Initialize position and start animation loop on page load
window.onload = () => {
  updatePosition();
  moveChickenBall();
};
