import { ColorAlgorithm } from "./models/utils/ColorAlgorithm.js";
import { ColorPalette } from "./models/ui/ColorPalette.js";
import { ColorInput } from "./models/ui/ColorInput.js";
import { ServiceWorker } from "./models/utils/ServiceWorker.js";
import { WelcomePage } from "./models/ui/WelcomePage.js";

const COLOR_NUM = 5;

const weclomePage = new WelcomePage();

const colorAlgorithm = new ColorAlgorithm();

const randomHexColor = colorAlgorithm.getRandomColor();
const randomColors = colorAlgorithm.createColorPalette(
  randomHexColor,
  COLOR_NUM
);

const colorPalette = new ColorPalette(randomColors);
const colorInput = new ColorInput(randomHexColor, colorPalette);
const serviceWorker = new ServiceWorker(weclomePage.htmlStartButton);
