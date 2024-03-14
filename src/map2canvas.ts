"use strict";

import { geogCoord } from "./canvec_15.ts";
import { lonlat2xy, getScale } from "./map_proj_equations.ts";

/**
 * Main function to be exported
 * @param projName projection name
 * @return the canvas point coordinates
 */
function getCanvasCoords(projName: string) {
  // min and max map coordinates
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  function getXyhk() {
    let lonlat = [];
    let xyhk = [];

    const geogCoordLength = geogCoord.features.length;
    for (let i = 0; i < geogCoordLength; i++) {
      lonlat.push(geogCoord.features[i].geom.coord[0][0]);
    }

    const lonlatLength = lonlat.length;
    for (let i = 0; i < lonlatLength; i++) {
      xyhk.push(lonlat2xy(lonlat[i], projName));
    }

    return xyhk;
  }

  function getMapPoints(xyhk: any, scale: number) {
    let points = [];

    const xyhkLength = xyhk.length;
    for (let i = 0; i < xyhkLength; i++) {
      let tmp = [];

      const iLength = xyhk[i].length;
      for (let j = 0; j < iLength; j++) {
        // y coordinate is multiplied by (-1) to flip coords on the x axis
        tmp.push([xyhk[i][j].x * scale, xyhk[i][j].y * scale * -1]);
      }

      const tmpLen = tmp.length;
      for (let j = 0; j < tmpLen; j++) {
        let x = tmp[j][0];
        let y = tmp[j][1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }

      points.push(tmp);
    }

    return points;
  }

  function getCanvasPoints(points: any) {
    let canvasPoints = [];
    const tx = minX * -1;
    const ty = minY * -1;

    const pointsLength = points.length;
    for (let i = 0; i < pointsLength; i++) {
      let arr = points[i];
      let tmp = [];

      const arrLength = arr.length;
      for (let j = 0; j < arrLength; j++) {
        tmp.push([arr[j][0] + tx + 15, arr[j][1] + ty + 15]);
      }
      canvasPoints.push(tmp);
    }

    return canvasPoints;
  }

  const xyhk = getXyhk();
  const scale = getScale(projName);
  const mapPoints = getMapPoints(xyhk, scale);
  const canvasPoints = getCanvasPoints(mapPoints);

  return canvasPoints;
}

export { getCanvasCoords };
