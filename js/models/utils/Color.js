export class Color {
  constructor() {}

  rgbToHex(rgbColor) {
    let hexColor = "";
    rgbColor.forEach((item) => {
      let itemHex = item.toString(16);
      if (itemHex.length === 1) {
        itemHex = "0" + itemHex;
      }
      hexColor += itemHex;
    });
    return hexColor;
  }

  hexToRgb(hexColor) {
    const rgbHexArray = hexColor.match(/.{1,2}/g);
    const rgbColor = rgbHexArray.map((item) => {
      return parseInt(item, 16);
    });
    return rgbColor;
  }

  hslToRgb(hslColor) {
    const h = hslColor[0];
    const s = hslColor[1];
    const l = hslColor[2];
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) =>
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);
    const rgbColor = [r, g, b];
    return rgbColor;
  }

  rgbToHsl(rgbColor) {
    const r = rgbColor[0] / 255;
    const g = rgbColor[1] / 255;
    const b = rgbColor[2] / 255;
    const v = Math.max(r, g, b),
      c = v - Math.min(r, g, b),
      f = 1 - Math.abs(v + v - c - 1);
    const h =
      c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
    const hValue = Math.round(60 * (h < 0 ? h + 6 : h));
    const sValue = f ? c / f : 0;
    const lValue = (v + v - c) / 2;
    const hslColor = [hValue, sValue, lValue];
    return hslColor;
  }

  hexToHsl(hexColor) {
    const rgbColor = this.hexToRgb(hexColor);
    const hslColor = this.rgbToHsl(rgbColor);
    return hslColor;
  }

  isDarkColor(hexColor) {
    const hslColor = this.hexToHsl(hexColor);
    const l = hslColor[2];
    if (l <= 0.5) {
      return true;
    } else {
      return false;
    }
  }

  lighten(hexColor, percentage) {
    const rgbColor = this.hexToRgb(hexColor);
    const newRgbColor = [];
    const maxLightenDegress = 255 - Math.min(...rgbColor);
    rgbColor.forEach((item) => {
      let newItem = Math.round(item + percentage * maxLightenDegress);
      newItem = Math.min(newItem, 255);
      newRgbColor.push(newItem);
    });
    const newHexColor = this.rgbToHex(newRgbColor);
    return newHexColor;
  }

  darken(hexColor, percentage) {
    const rgbColor = this.hexToRgb(hexColor);
    const newRgbColor = [];
    const maxDarkenDegress = Math.max(...rgbColor);
    rgbColor.forEach((item) => {
      let newItem = Math.round(item - percentage * maxDarkenDegress);
      newItem = Math.max(newItem, 0);
      newRgbColor.push(newItem);
    });
    const newHexColor = this.rgbToHex(newRgbColor);
    return newHexColor;
  }
}
