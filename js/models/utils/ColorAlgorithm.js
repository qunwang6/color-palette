import { Color } from "./Color.js";

const GRADIENT_RATIO = 0.6;
const HSL_ROTATE_DEGREES = 60;
const MAX_HSL_SATURATION_RATIO = 0.6;
const MAX_RANDOM_HSL_SATURATION = 0.8;

const color = new Color();

export class ColorAlgorithm {
  constructor() {}

  createGradientColors(hexColor, colorNum) {
    const gradientColors = [];
    for (let i = 0; i < colorNum; i++) {
      let newHexColor;
      const degress = (1 / (colorNum - 1)) * i * GRADIENT_RATIO;
      if (color.isDarkColor(hexColor)) {
        newHexColor = color.lighten(hexColor, degress);
      } else {
        newHexColor = color.darken(hexColor, degress);
      }
      gradientColors.push(newHexColor);
    }
    return gradientColors;
  }

  getComplementaryColor(hexColor) {
    const rgbColor = color.hexToRgb(hexColor);
    const hslColor = color.rgbToHsl(rgbColor);
    const hslDegrees = HSL_ROTATE_DEGREES;
    // Adjust hue
    if (hslColor[0] >= 0 && hslColor[0] < 180) {
      hslColor[0] = hslColor[0] + hslDegrees;
    } else {
      hslColor[0] = hslColor[0] - hslDegrees;
    }
    // Adjust saturation, make color be more softer
    hslColor[1] = Math.min(hslColor[1], MAX_HSL_SATURATION_RATIO);
    const complementaryRgbColor = color.hslToRgb(hslColor);
    const complementaryColor = color.rgbToHex(complementaryRgbColor);
    return complementaryColor;
  }

  createColorPalette(hexColor, colorNum) {
    const colors = this.createGradientColors(hexColor, colorNum - 1);
    const complementaryColor = this.getComplementaryColor(hexColor);
    // complementaryColor will be placed as 2nd color in the palette
    colors.splice(1, 0, complementaryColor);
    return colors;
  }

  getRandomColor() {
    let randomHexColor = "";
    let isValidColor = false;
    // To prevent high saturation color
    while (!isValidColor) {
      for (let i = 0; i < 6; i++) {
        const randInt = Math.floor(Math.random() * 16);
        const randHex = randInt.toString(16).toUpperCase();
        randomHexColor += randHex;
      }
      let hslColor = color.hexToHsl(randomHexColor);
      // saturation color must be less than 0.8
      if (hslColor[1] < MAX_RANDOM_HSL_SATURATION) {
        isValidColor = true;
      } else {
        // reset the randomHexColor value for next loop
        randomHexColor = "";
      }
    }
    return randomHexColor;
  }
}
