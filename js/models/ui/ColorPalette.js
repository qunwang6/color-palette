import { Color } from "../utils/Color.js";

const COLOR_PALETTE_CLASS_NAME = "color-palette";
const BOX_CLASS_NAME = COLOR_PALETTE_CLASS_NAME + "__box";
const BOX_HEX_CODE_CLASS_NAME = BOX_CLASS_NAME + "__hex-code";
const BOX_HEX_CODE_SVG_CLASS_NAME = BOX_HEX_CODE_CLASS_NAME + "__svg";
const TEXT_CONTRAST_RATIO = 0.5;
const POP_UP_SEC = 0.5;
const COPY_SVG_HTML = `<svg class="${BOX_HEX_CODE_SVG_CLASS_NAME}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 210.107 210.107" xml:space="preserve"><g><path d="M168.506,0H80.235C67.413,0,56.981,10.432,56.981,23.254v2.854h-15.38c-12.822,0-23.254,10.432-23.254,23.254v137.492c0,12.822,10.432,23.254,23.254,23.254h88.271c12.822,0,23.253-10.432,23.253-23.254V184h15.38c12.822,0,23.254-10.432,23.254-23.254V23.254C191.76,10.432,181.328,0,168.506,0zM138.126,186.854c0,4.551-3.703,8.254-8.253,8.254H41.601c-4.551,0-8.254-3.703-8.254-8.254V49.361c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.253,3.703,8.253,8.254V186.854z M176.76,160.746c0,4.551-3.703,8.254-8.254,8.254h-15.38V49.361c0-12.822-10.432-23.254-23.253-23.254H71.981v-2.854c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.254,3.703,8.254,8.254V160.746z"/></g></svg>`;
const COPY_SHOW_SEC = 0.75;

const color = new Color();

export class ColorPalette {
  constructor(colors) {
    this.colors = colors;
    this.colorNum = colors.length;
    this.htmlColorPalette = document.querySelector(
      "." + COLOR_PALETTE_CLASS_NAME
    );
    this.htmlBoxes = this.createHtmlBoxes();
    this.boxHoverColors = [];
    this.popUpIsLoading = false;
    this.popUpMilSec = POP_UP_SEC * 1000;
    this.updateBoxColors(colors);
    this.copyHandler();
  }

  createHtmlBoxes() {
    let htmlString = "";
    for (let i = 0; i < this.colorNum; i++) {
      htmlString += `<div class="${BOX_CLASS_NAME}"></div>`;
    }
    this.htmlColorPalette.innerHTML = htmlString;
    const htmlBoxes = this.htmlColorPalette.childNodes;
    return htmlBoxes;
  }

  updateBoxColors(colors) {
    this.colors = colors;
    this.htmlBoxes.forEach((box, index) => {
      box.classList.remove(BOX_CLASS_NAME + "--copied"); // Prevent the hex code showing by fast clicking
      const hexColor = this.colors[index].toUpperCase();
      box.style.backgroundColor = "#" + hexColor;
      box.innerHTML = `<p class="${BOX_HEX_CODE_CLASS_NAME}">#${hexColor} ${COPY_SVG_HTML}</p>`;
      let hoverColor = "";
      if (color.isDarkColor(hexColor)) {
        hoverColor = color.lighten(hexColor, TEXT_CONTRAST_RATIO);
      } else {
        hoverColor = color.darken(hexColor, TEXT_CONTRAST_RATIO);
      }
      const htmlBoxHexCode = box.querySelector(`.${BOX_HEX_CODE_CLASS_NAME}`);
      const htmlBoxHexCodeSvg = box.querySelector(
        "." + BOX_HEX_CODE_SVG_CLASS_NAME
      );
      htmlBoxHexCode.style.color = "#" + hoverColor;
      htmlBoxHexCodeSvg.style.fill = "#" + hoverColor;
      this.boxHoverColors[index] = hoverColor;
    });
    this.htmlColorPalette.classList.add(COLOR_PALETTE_CLASS_NAME + "--pop-up");
    this.popUpIsLoading = true;
    setTimeout(() => {
      this.htmlColorPalette.classList.remove(
        COLOR_PALETTE_CLASS_NAME + "--pop-up"
      );
      this.popUpIsLoading = false;
    }, this.popUpMilSec);
  }

  copyHandler() {
    const WORD = "Copied ✔";
    this.htmlBoxes.forEach((box, index) => {
      box.addEventListener("click", (event) => {
        const htmlBoxHexCode = box.querySelector("." + BOX_HEX_CODE_CLASS_NAME);
        if (htmlBoxHexCode.innerText !== WORD) {
          const hexCode = this.colors[index].toUpperCase();
          const boxHoverColorCode = this.boxHoverColors[index];
          navigator.clipboard.writeText(hexCode);
          htmlBoxHexCode.innerText = WORD;
          box.classList.add(BOX_CLASS_NAME + "--copied");
          box.style.backgroundColor = "#" + boxHoverColorCode;
          htmlBoxHexCode.style.color = "#" + hexCode;
          setTimeout(() => {
            const latestHexCode = this.colors[index].toUpperCase();
            const latestBoxHoverColorCode = this.boxHoverColors[index];
            htmlBoxHexCode.innerHTML = "#" + latestHexCode + COPY_SVG_HTML;
            const htmlBoxHexCodeSvg = box.querySelector(
              "." + BOX_HEX_CODE_SVG_CLASS_NAME
            );
            box.classList.remove(BOX_CLASS_NAME + "--copied");
            box.style.backgroundColor = "#" + latestHexCode;
            htmlBoxHexCode.style.color = "#" + latestBoxHoverColorCode;
            htmlBoxHexCodeSvg.style.fill = "#" + latestBoxHoverColorCode;
          }, COPY_SHOW_SEC * 1000);
        }
      });
    });
  }
}
