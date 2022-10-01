import http from "http";
import express from "express";
import { Server } from "socket.io";

import generatePixelData from "./src/generatePixelData.js";
import drawPixel from "./src/drawPixel.js";

// Server settings
const app = express();
const server = http.createServer(app);

const io = new Server(server);

// Game settings
const pixelSize = 6;
const canvasWidth = 1400;
const canvasHeight = 600;

const REST_TIME_MS = 1000;

const updateTable = {};

/**
 * {
 *   "QcORuMc0MqOOJSLYAAAN": "2022-04-22T00:19:21.924Z",
 *   "fJY6hfhWokt9W1jbAAAP": "2022-04-22T00:19:28.924Z",
 * }
 */

let pixelData = generatePixelData({
  pixelSize,
  width: canvasWidth,
  height: canvasHeight,
});



// Server routes
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A user is connected [${socket.id}]`);
  const id =
    process.env.NODE_ENV === "production"
      ? socket.conn.remoteAddress
      : socket.id;
  socket.emit("join-pixel-data", {
    pixelData,
    pixelSize,
    canvasHeight,
    canvasWidth,
  });

  socket.on("update-pixel-data", ({ color, rowIndex, colIndex }) => {
    if (
      color?.length &&
      rowIndex >= 0 &&
      rowIndex < pixelData.length &&
      colIndex >= 0 &&
      colIndex < pixelData[0].length
    ) {
      let canUpdatePixel = false;

     
      if (!updateTable.hasOwnProperty(id)) {
        
        canUpdatePixel = true;
      } else {
       
        const ms = new Date(updateTable[id]).getTime();
        const elapsedMs = new Date().getTime() - ms;
        if (elapsedMs >= REST_TIME_MS) {
         
          canUpdatePixel = true;
        }
      }

      if (!canUpdatePixel) {
       
        socket.emit("cannot-update");
        return;
      }

      

      updateTable[id] = new Date().getTime();

      drawPixel({
        pixelData,
        color,
        rowIndex,
        colIndex,
      });

      io.emit("update-pixel-data", pixelData);
    }
  });
});

// Server start
server.listen(process.env.PORT|| 3000, () => {
  console.log("Server started");
});
