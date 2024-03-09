"use strict";

import "./style.css";
//import { scale_, output } from "./map2canvas.ts";
//import { getXyhk, getPreDrawingPoints, getDrawingPoints } from "./map2canvas.ts";
//import { getScale } from "./map_proj_equations.ts";
import { getCanvasCoords } from "./map2canvas.ts";

window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded() {
  drawScreen();
}

function drawScreen() {
  const theCanvas = document.getElementById("canvas");
  const context = theCanvas.getContext("2d");

  if (!theCanvas || !context) {
    return;
  }

  theCanvas.style.background = "white";  // a valid CSS colour.

  context.clearRect(0, 0, theCanvas.width, theCanvas.height);

  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.lineCap = 'round';

  //context.beginPath();
  //context.moveTo(output[0][0][0], output[0][0][1]);
  //console.log(output[0][0][0], output[0][0][1])

  const projName = "UTM Z19"
  const canvasCoords = getCanvasCoords(projName)

  for (const arry of canvasCoords) {
    context.beginPath();
    context.moveTo(arry[0][0], arry[0][1]);
    for (const item of arry) {
      context.lineTo(item[0], item[1]);
    }
    context.stroke();
    context.closePath();
  }


  

  //console.log(Array.isArray(output))
  //console.log(output)
  //console.log(output[0][0], output[0][1])
}

