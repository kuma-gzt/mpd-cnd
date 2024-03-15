"use strict";

import { geogCoord } from "./canvec_15.ts";
import { lonlat2xy, getScale } from "./map_proj_equations.ts";

interface XYHK {
  x: number;
  y: number;
  h: number;
  k: number;
}

type ArrCoords = [number, number];

type XYHKArray = XYHK[];

/**
 * Main function to be exported
 * @param projName projection name
 * @return the canvas point coordinates
 */
function getCanvasCoords(projName: string) {
  // min and max map coordinates
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  function getXyhk(): XYHKArray[] {
    const lonlat: ArrCoords[] = [];
    const xyhk: XYHKArray[] = [];

    // using traditional for loop for better perfomance
    const geogCoordLength = geogCoord.features.length;
    for (let i = 0; i < geogCoordLength; i++) {
      lonlat.push(geogCoord.features[i].geom.coord[0][0]);
    }

    // using traditional for loop for better perfomance
    const lonlatLength = lonlat.length;
    for (let i = 0; i < lonlatLength; i++) {
      xyhk.push(lonlat2xy(lonlat[i], projName));
    }

    return xyhk;
  }

  function getMapPoints(xyhk: XYHKArray[], scale: number): ArrCoords[][] {
    const points: ArrCoords[][] = [];

    // using traditional for loop for better perfomance
    const xyhkLength = xyhk.length;
    for (let i = 0; i < xyhkLength; i++) {
      const tmp: ArrCoords[] = [];

      // using traditional for loop for better perfomance
      const iLength = xyhk[i].length;
      for (let j = 0; j < iLength; j++) {
        // y coordinate is multiplied by (-1) to flip coords on the x axis
        tmp.push([xyhk[i][j].x * scale, xyhk[i][j].y * scale * -1]);
      }

      // using traditional for loop for better perfomance
      const tmpLength = tmp.length;
      for (let k = 0; k < tmpLength; k++) {
        let x = tmp[k][0];
        let y = tmp[k][1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
      }

      points.push(tmp);
    }

    return points;
  }

  function getCanvasPoints(points: ArrCoords[][]): ArrCoords[][] {
    const canvasPoints: ArrCoords[][] = [];
    const tx = minX * -1;
    const ty = minY * -1;

    // using traditional for loop for better perfomance
    const pointsLength = points.length;
    for (let i = 0; i < pointsLength; i++) {
      let arr = points[i];
      let tmp: ArrCoords[] = [];

      // using traditional for loop for better perfomance
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
