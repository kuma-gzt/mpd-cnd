"use strict";

import "./style.css";
import { getCanvasCoords } from "./map2canvas.ts";
import { IDX_COLORS } from "./constants.ts";

let lat1 = 49;
let lat2 = 77;

drawOnScreen(lat1, lat2);

window.addEventListener("load", firstLatEvent, false);
window.addEventListener("load", secondLatEvent, false);

/**
 * Function to handle the firstLat range slide events
 * @param
 * @return
 */
function firstLatEvent() {
  const firstLatLbl = document.getElementById("firstLatLbl");
  const firstLat = document.getElementById("firstLat");
  firstLat.oninput = function () {
    drawOnScreen(Number(this.value), lat2);
    lat1 = Number(this.value);
    firstLatLbl.innerText = `Standard parallel #1 = ${lat1}°`;
  };
}

/**
 * Function to handle the secondLat range slide events
 * @param
 * @return
 */
function secondLatEvent() {
  const secondLatLbl = document.getElementById("secondLatLbl");
  const secondLat = document.getElementById("secondLat");
  secondLat.oninput = function () {
    drawOnScreen(lat1, Number(this.value));
    lat2 = Number(this.value);
    secondLatLbl.innerText = `Standard parallel #2 = ${lat2.toFixed(0)}°`;
  };
}

/**
 * Function to draw on the canvas 1 and canvas 2
 * @param lat1 first standard parallel
 * @param lat2 second standard parallel
 * @return
 */
function drawOnScreen(lat1, lat2) {
  // map canvas
  const theCanvas1 = document.getElementById("canvas1");
  const context1 = theCanvas1.getContext("2d");

  if (!theCanvas1 || !context1) {
    return;
  }

  theCanvas1.style.background = "#0e1112";
  context1.clearRect(0, 0, theCanvas1.width, theCanvas1.height);

  // scale factors canvas
  const theCanvas2 = document.getElementById("canvas2");
  const context2 = theCanvas2.getContext("2d");

  if (!theCanvas2 || !context2) {
    return;
  }

  theCanvas2.style.background = "#0e1112";
  context2.clearRect(0, 0, theCanvas2.width, theCanvas2.height);
  context2.font = "14px sans-serif";
  context2.fillStyle = "white";
  context2.fillText("Scale factors for ", 20, 25);
  context2.fillText(`standard parallel #1 = ${lat1}°`, 20, 45);
  context2.fillText(`standard parallel #2 = ${lat2.toFixed(0)}°`, 20, 65);

  // get the canvas coordinates to plot
  const canvasCoords = getCanvasCoords(lat1, lat2);

  // using traditional for loop for better perfomance
  const canvasCoordsLength = canvasCoords.length;
  for (let i = 0; i < canvasCoordsLength; i++) {
    const tmp = canvasCoords[i].xyhk;
    const tmpLength = canvasCoords[i].xyhk.length;

    // plotting the central meridian and the standard parallels
    if (
      canvasCoords[i].prv == "stanPara1" ||
      canvasCoords[i].prv == "stanPara2" ||
      canvasCoords[i].prv == "centralMerid"
    ) {
      context1.strokeStyle = "white";
      context1.lineWidth = 3;
      context1.lineCap = "round";

      context1.beginPath();
      context1.moveTo(tmp.x, tmp.y);

      for (let j = 0; j < tmpLength; j++) {
        context1.lineTo(tmp[j].x, tmp[j].y);
      }

      context1.stroke();
      context1.closePath();

      // plotting the indicatrix
    } else if (canvasCoords[i].prv == "indicatrix") {
      context1.strokeStyle = "white";
      context1.lineWidth = 0.5;
      for (let j = 0; j < tmpLength; j++) {
        context1.beginPath();
        context1.arc(tmp[j].x, tmp[j].y, 10 * tmp[j].h, 0, 2 * Math.PI);
        context1.stroke();
      }

      let vShift = 100;
      for (let j = 40; j < 50; j++) {
        context1.strokeStyle = IDX_COLORS[j];
        context1.lineWidth = 0.5;
        context1.fillStyle = IDX_COLORS[j];
        context1.beginPath();
        context1.arc(tmp[j].x, tmp[j].y, 10 * tmp[j].h, 0, 2 * Math.PI);
        context1.fill();
        context1.stroke();

        canvas2Distortion(
          context2,
          IDX_COLORS[j],
          `k = h = ${tmp[j].h.toFixed(3)}`,
          tmp[j].h,
          15,
          20,
          vShift
        );
        vShift = vShift + 40;
      }
    }

    // plotting the Canada polygons
    else {
      context1.fillStyle = "#666666";
      context1.strokeStyle = "black";
      context1.lineWidth = 1;
      context1.lineCap = "round";

      context1.beginPath();
      context1.moveTo(tmp.x, tmp.y);
      for (let j = 0; j < tmpLength; j++) {
        context1.lineTo(tmp[j].x, tmp[j].y);
      }
      context1.fill();
      context1.stroke();
      context1.closePath();
    }
  }
}

/**
 * This function plots the scale factors in the canvas #2
 * @param ctx context
 * @param idxColor color of the indicatrix
 * @param idxText h, k scale factor of the indicatrix
 * @param factorHK actual factor (number)
 * @param side side length in pixels of the bar
 * @param hShift horizontal shift in pixels for the text + bar
 * @param vShift vertical shift in pixels for the text + bar *
 * @return the canvas point coordinates
 */
function canvas2Distortion(
  ctx,
  idxColor,
  idxText,
  factorHK,
  side,
  hShift,
  vShift
) {
  const area = side * Math.pow(factorHK, 8);
  ctx.font = "14px sans-serif";
  ctx.fillStyle = idxColor;
  ctx.fillText(idxText, hShift, vShift);

  ctx.strokeStyle = idxColor;
  ctx.fillRect(hShift * 6, vShift - 12, area, side);
  ctx.stroke();
}
