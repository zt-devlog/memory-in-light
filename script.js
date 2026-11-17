const screens = Array.from(
  document.querySelectorAll("[data-screen]")
);

const nextButtons = Array.from(
  document.querySelectorAll("[data-next]")
);

const backButtons = Array.from(
  document.querySelectorAll("[data-back]")
);

const restartButtons = Array.from(
  document.querySelectorAll("[data-restart]")
);

const progressLabel =
  document.getElementById("progress-label");

const experienceNav =
  document.querySelector(".experience-nav");

const feedbackForm =
  document.getElementById("feedback-form");

const formStatus =
  document.getElementById("form-status");

const submitButton =
  document.getElementById("submit-feedback");

let currentScreen = 0;

const labels = [
  "Introduction",
  "Environment 1 of 4",
  "Environment 2 of 4",
  "Environment 3 of 4",
  "Environment 4 of 4",
  "Reflection",
  "Complete"
];

function showScreen(index) {
  const clampedIndex = Math.max(
    0,
    Math.min(index, screens.length - 1)
  );

  currentScreen = clampedIndex;

  screens.forEach((screen, i) => {
    const isCurrent = i === currentScreen;

    screen.classList.toggle(
      "is-active",
      isCurrent
    );

    screen.setAttribute(
      "aria-hidden",
      isCurrent ? "false" : "true"
    );
  });

  if (progressLabel) {
    progressLabel.textContent =
      labels[currentScreen];
  }

  if (experienceNav) {
    const isEnvironment =
      currentScreen >= 1 &&
      currentScreen <= 4;

    experienceNav.hidden =
      !isEnvironment;
  }

  backButtons.forEach((button) => {
    button.disabled =
      currentScreen <= 1;
  });

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}

function goNext() {
  if (currentScreen < 5) {
    showScreen(currentScreen + 1);
  }
}

function goBack() {
  if (currentScreen > 1) {
    showScreen(currentScreen - 1);
  }
}

function restart() {
  if (feedbackForm) {
    feedbackForm.reset();
  }

  if (formStatus) {
    formStatus.textContent = "";
  }

  showScreen(0);
}

nextButtons.forEach((button) => {
  button.addEventListener(
    "click",
    goNext
  );
});

backButtons.forEach((button) => {
  button.addEventListener(
    "click",
    goBack
  );
});

restartButtons.forEach((button) => {
  button.addEventListener(
    "click",
    restart
  );
});


/* =========================================
   FEEDBACK FORM
   ========================================= */

if (feedbackForm) {
  feedbackForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (!feedbackForm.checkValidity()) {
        feedbackForm.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent =
        "Submitting...";

      formStatus.textContent =
        "Sending your response...";

      try {
        const formData =
          new FormData(feedbackForm);

        const response = await fetch(
          feedbackForm.action,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error(
            "Form submission failed"
          );
        }

        formStatus.textContent =
          "Response submitted.";

        feedbackForm.reset();

        showScreen(6);
      } catch (error) {
        console.error(error);

        formStatus.textContent =
          "Your response could not be submitted. Please try again.";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent =
          "Submit response";
      }
    }
  );
}


/* =========================================
   KEYBOARD NAVIGATION
   ========================================= */

document.addEventListener(
  "keydown",
  (event) => {
    const activeTag =
      document.activeElement
        ?.tagName
        ?.toLowerCase();

    const isTyping =
      activeTag === "textarea" ||
      activeTag === "input" ||
      activeTag === "select";

    if (isTyping) {
      return;
    }

    if (
      currentScreen >= 1 &&
      currentScreen <= 4
    ) {
      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goBack();
      }
    }
  }
);

showScreen(0);
