import { ColorAlgorithm } from "../utils/ColorAlgorithm.js";

const COLOR_INPUT_CLASS_NAME = "hex-color-input";
const COLOR_INPUT_TEXT_CLASS_NAME = COLOR_INPUT_CLASS_NAME + "__text__word";
const COLOR_INPUT_COLOR_CONTAINER_CLASS_NAME =
  COLOR_INPUT_CLASS_NAME + "__color-container";
const COLOR_INPUT_COLOR_CLASS_NAME = COLOR_INPUT_CLASS_NAME + "__color";
const COLOR_INPUT_RANDOM_BUTTON_CLASS_NAME =
  COLOR_INPUT_CLASS_NAME + "__random";

const colorAlgorithm = new ColorAlgorithm();

export class ColorInput {
  constructor(text, ColorPalette) {
    this.colorInputText = document.querySelector(
      "." + COLOR_INPUT_TEXT_CLASS_NAME
    );
    this.colorInputColorContainer = document.querySelector(
      "." + COLOR_INPUT_COLOR_CONTAINER_CLASS_NAME
    );
    this.colorInputColor = document.querySelector(
      "." + COLOR_INPUT_COLOR_CLASS_NAME
    );
    this.colorInputRandomButton = document.querySelector(
      "." + COLOR_INPUT_RANDOM_BUTTON_CLASS_NAME
    );
    this.colorPaletteMainColor = ColorPalette.colors[0].toUpperCase();
    this.currentValidInput = text; // It record client's valid input
    this.updateInputValues(text);
    this.colorInputTextHandler(ColorPalette);
    this.colorInputColorHandler(ColorPalette);
    this.colorInputRandomButtonHandler(ColorPalette);
  }

  isValidInput(input) {
    if (
      (input.length <= 6 && /^[A-Fa-f0-9]+$/.test(input)) ||
      input.length == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  // In this stage, we only provide 6 digits hex code color
  isValidInputLength(input) {
    const check = input.length === 6;
    return check;
  }

  updateInputValues(hexColorText) {
    this.colorInputText.value = hexColorText.toUpperCase();
    this.colorInputColor.value = "#" + hexColorText;
    this.currentValidInput = hexColorText;
  }

  updateColorPalette(colorPalette) {
    const input = this.currentValidInput;

    if (input !== this.colorPaletteMainColor) {
      const colors = colorAlgorithm.createColorPalette(
        input,
        colorPalette.colorNum
      );
      colorPalette.updateBoxColors(colors);
      this.colorPaletteMainColor = colorPalette.colors[0].toUpperCase();
      this.colorInputText.setAttribute("disabled", "");
      this.colorInputColorContainer.classList.add(
        COLOR_INPUT_COLOR_CONTAINER_CLASS_NAME + "--disabled"
      );
      this.colorInputColor.setAttribute("disabled", "");
      setTimeout(() => {
        this.colorInputText.removeAttribute("disabled");
        this.colorInputColorContainer.classList.remove(
          COLOR_INPUT_COLOR_CONTAINER_CLASS_NAME + "--disabled"
        );
        this.colorInputColor.removeAttribute("disabled");
      }, colorPalette.popUpMilSec);
    }
  }

  colorInputTextHandler(colorPalette) {
    this.colorInputText.addEventListener("input", (event) => {
      const text = event.target.value;
      if (this.isValidInput(text)) {
        this.updateInputValues(text);
        this.currentValidInput = text;
      } else {
        this.updateInputValues(this.currentValidInput);
      }
    });

    this.colorInputText.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        if (this.isValidInputLength(event.target.value)) {
          this.updateColorPalette(colorPalette);
        } else {
          this.updateInputValues(this.colorPaletteMainColor);
        }
      }
    });

    this.colorInputText.addEventListener("focusout", (event) => {
      if (this.isValidInputLength(event.target.value)) {
        this.updateColorPalette(colorPalette);
      } else {
        this.updateInputValues(this.colorPaletteMainColor);
      }
    });
  }

  colorInputColorHandler(colorPalette) {
    this.colorInputColor.addEventListener("input", (event) => {
      const hexColorText = event.target.value.slice(1);
      this.updateInputValues(hexColorText);
    });

    this.colorInputColor.addEventListener("change", (event) => {
      this.updateColorPalette(colorPalette);
    });
  }

  colorInputRandomButtonHandler(colorPalette) {
    this.colorInputRandomButton.addEventListener("click", (event) => {
      const isValidButton = !colorPalette.popUpIsLoading;
      if (isValidButton) {
        let randomColor;
        let randomColorIsNotSame = false;
        // Prevent generate same random color
        while (!randomColorIsNotSame) {
          randomColor = colorAlgorithm.getRandomColor();
          if (randomColor.toUpperCase() !== this.currentValidInput) {
            randomColorIsNotSame = true;
          }
        }
        this.updateInputValues(randomColor);
        this.updateColorPalette(colorPalette);
        this.colorInputRandomButton.classList.add(
          COLOR_INPUT_RANDOM_BUTTON_CLASS_NAME + "--spin"
        );
        setTimeout(() => {
          this.colorInputRandomButton.classList.remove(
            COLOR_INPUT_RANDOM_BUTTON_CLASS_NAME + "--spin"
          );
        }, colorPalette.popUpMilSec);
      }
    });
  }
}
