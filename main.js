import { CustomToolWin } from "./CustomToolWin.js";

const toolWin = new CustomToolWin();

const openToolWinButton = document.getElementById("open_toolwin_btn");

const nx = 2;
const ny = 7;
const buttonSize = 50;

const images = [
  "/svg/dot.svg",
  "/svg/line.svg",
  "/svg/rect.svg",
  "/svg/ellipse.svg",
  "/svg/circle.svg",
  "/svg/fill.svg",
  "/svg/rubber.svg",
  "/svg/hand-grab.svg",
  "/svg/scale-plus.svg",
  "/svg/scale-minus.svg",
  "/svg/arrow-back.svg",
  "/svg/spectrum.svg",
  "/svg/widthSize.svg",
  "/svg/delete.svg",
];

const tooltips = [
  "Малювання точки",
  "Малювання лінії",
  "Малювання прямокутника",
  "Малювання еліпса",
  "Малювання круга",
  "Інструмент заливання",
  "Інструмент ластик",
  "Переміщення об'єкту",
  "Інструмент збільшення",
  "Інструмент зменшення",
  "Скасування останньої дії",
  "Зміна кольору",
  "Зміна товщини",
  "Очищення",
];

openToolWinButton.addEventListener("click", () => {
  toolWin.createToolWinWithActions(nx, ny, buttonSize, images, tooltips);
});
