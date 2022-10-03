import firstDrawPixel from "./pixel/firstDrawPixel.js";
import drawPixel from "./pixel/drawPixel.js";
import onClickColor from "./events/onClickColor.js";
import onClickPixel from "./events/onClickPixel.js";

const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");

let selectedColor = null;
let pixelSizeFront = null;

const socket = io();

socket.on(
  "join-pixel-data",
  ({ pixelData, pixelSize, canvasWidth, canvasHeight }) => {
    pixelSizeFront = pixelSize;
    firstDrawPixel({
      canvasEl,
      ctx,
      pixelData,
      pixelSize,
      canvasWidth,
      canvasHeight,
    });
    onClickPixel({
      canvasEl,
      pixelSize,
      callback: ({ rowIndex, colIndex }) => {
        socket.emit("update-pixel-data", {
          color: selectedColor,
          rowIndex,
          colIndex,
        });
      },
    });
  }
);

socket.on("update-pixel-data", (pixelData) => {
  console.table("pixelData", pixelData);
  drawPixel({
    ctx,
    pixelData,
    pixelSize: pixelSizeFront,
    canvasWidth: canvasEl.width,
    canvasHeight: canvasEl.height,
  });
});

socket.on("cannot-update", () => {
  
});

onClickColor({
  callback: (color) => {
    selectedColor = color;
  },
});


