const WELCOME_PAGE_CLASS_NAME = "welcome-page";
const WELCOME_IMAGE_CLASS_NAME = WELCOME_PAGE_CLASS_NAME + "__image-container";
const START_BUTTON_CLASS_NAME = WELCOME_PAGE_CLASS_NAME + "__start-button";
const START_BUTTON_EFFECT_SEC = 1.5;

export class WelcomePage {
  constructor() {
    this.htmlWelcomePage = document.querySelector(
      "." + WELCOME_PAGE_CLASS_NAME
    );
    this.htmlWelcomeImage = document.querySelector(
      "." + WELCOME_IMAGE_CLASS_NAME
    );
    this.htmlStartButton = document.querySelector(
      "." + START_BUTTON_CLASS_NAME
    );
    this.startButtonEffectMilSec = START_BUTTON_EFFECT_SEC * 1000;
    this.startButtonHandler();
  }

  startButtonHandler() {
    this.htmlStartButton.addEventListener("click", (event) => {
      this.htmlWelcomePage.classList.add(
        WELCOME_PAGE_CLASS_NAME + "--hide-elements"
      );
      this.htmlWelcomeImage.classList.remove(
        WELCOME_IMAGE_CLASS_NAME + "--jump"
      );
      this.htmlWelcomeImage.classList.add(
        WELCOME_IMAGE_CLASS_NAME + "--closed"
      );
      setTimeout(() => {
        this.htmlWelcomePage.classList.add(
          WELCOME_PAGE_CLASS_NAME + "--closed"
        );
      }, this.startButtonEffectMilSec);
    });
  }
}
