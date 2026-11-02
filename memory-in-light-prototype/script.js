const screens = Array.from(document.querySelectorAll("[data-screen]"));
const nextButtons = Array.from(document.querySelectorAll("[data-next]"));
const backButtons = Array.from(document.querySelectorAll("[data-back]"));
const restartButtons = Array.from(document.querySelectorAll("[data-restart]"));
const progressLabel = document.getElementById("progress-label");

let currentScreen = 0;

const labels = [
  "Introduction",
  "Environment 1 of 4",
  "Environment 2 of 4",
  "Environment 3 of 4",
  "Environment 4 of 4",
  "Reflection"
];

function showScreen(index) {
  const clampedIndex = Math.max(0, Math.min(index, screens.length - 1));
  currentScreen = clampedIndex;

  screens.forEach((screen, i) => {
    screen.classList.toggle("is-active", i === currentScreen);
    screen.setAttribute("aria-hidden", i === currentScreen ? "false" : "true");
  });

  progressLabel.textContent = labels[currentScreen];

  backButtons.forEach((button) => {
    button.disabled = currentScreen === 0;
  });

  nextButtons.forEach((button) => {
    const isGlobalNext = button.closest(".experience-nav");
    if (isGlobalNext) {
      button.disabled = currentScreen === screens.length - 1;
    }
  });

  window.scrollTo({ top: 0, behavior: "auto" });
}

function goNext() {
  showScreen(currentScreen + 1);
}

function goBack() {
  showScreen(currentScreen - 1);
}

function restart() {
  showScreen(0);
}

nextButtons.forEach((button) => button.addEventListener("click", goNext));
backButtons.forEach((button) => button.addEventListener("click", goBack));
restartButtons.forEach((button) => button.addEventListener("click", restart));

document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  const isTyping = activeTag === "textarea" || activeTag === "input";

  if (isTyping) return;

  if (event.key === "ArrowRight") goNext();
  if (event.key === "ArrowLeft") goBack();
});

showScreen(0);
