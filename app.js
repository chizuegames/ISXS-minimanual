const pages = Array.from({ length: 15 }, (_, index) => `R${index + 1}.png`);

const pageImage = document.getElementById("manual-page");

let currentPage = 0;
let tapTimer = null;
let pointerStart = null;

const DOUBLE_TAP_DELAY = 280;
const MAX_TAP_MOVEMENT = 24;

function showPage(index) {
  const boundedIndex = Math.max(0, Math.min(index, pages.length - 1));

  if (boundedIndex === currentPage && pageImage.src.endsWith(pages[boundedIndex])) {
    return;
  }

  currentPage = boundedIndex;
  pageImage.src = pages[currentPage];
  pageImage.alt = `Página ${currentPage + 1} del mini manual`;

  preloadAroundCurrentPage();
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
}

function previousPage() {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
}

function preloadImage(index) {
  if (index < 0 || index >= pages.length) return;

  const image = new Image();
  image.src = pages[index];
}

function preloadAroundCurrentPage() {
  preloadImage(currentPage + 1);
  preloadImage(currentPage - 1);
}

function registerTap() {
  if (tapTimer !== null) {
    clearTimeout(tapTimer);
    tapTimer = null;
    previousPage();
    return;
  }

  tapTimer = window.setTimeout(() => {
    tapTimer = null;
    nextPage();
  }, DOUBLE_TAP_DELAY);
}

document.addEventListener(
  "pointerdown",
  (event) => {
    if (!event.isPrimary) return;

    pointerStart = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };

    event.preventDefault();
  },
  { passive: false }
);

document.addEventListener(
  "pointerup",
  (event) => {
    if (
      !event.isPrimary ||
      !pointerStart ||
      pointerStart.id !== event.pointerId
    ) {
      return;
    }

    const movement = Math.hypot(
      event.clientX - pointerStart.x,
      event.clientY - pointerStart.y
    );

    pointerStart = null;
    event.preventDefault();

    if (movement <= MAX_TAP_MOVEMENT) {
      registerTap();
    }
  },
  { passive: false }
);

document.addEventListener(
  "pointercancel",
  () => {
    pointerStart = null;
  },
  { passive: true }
);

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("dblclick", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
    event.preventDefault();
    nextPage();
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Backspace") {
    event.preventDefault();
    previousPage();
  }
});

pages.forEach((page) => {
  const image = new Image();
  image.src = page;
});

showPage(0);
