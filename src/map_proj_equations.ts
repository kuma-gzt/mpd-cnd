"use strict";

import { APP_CONS, BOUND_CONS } from "./constants.ts";
import { utm_lonlat2xy, getLonOriginUTM } from "./utm_proj.ts";

interface XYHK {
  x: number;
  y: number;
  h: number;
  k: number;
}

interface MinMax {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

type ArrCoords = [number, number];
type XYHKArray = XYHK[];

/**
 * Calculates the x-y coordinates and h-k factors from lon-lat coordinates
 * @param lonlatArray array of lons and lats
 * @param projName projection name
 * @return an array holding the x, y, h and k values
 */
function lonlat2xy(lonlatArray: ArrCoords, projName: string): XYHKArray {
  const xyhkArray: XYHKArray = [];

  if (projName.includes("UTM")) {
    const lat_orig = 0; // origin latitude is always at the equator, hence lat_orig is zero
    const lon_orig = getLonOriginUTM(projName);

    // using traditional for loop for better perfomance
    const arrLength = lonlatArray.length;
    for (let i = 0; i < arrLength; i++) {
      let xyhk: XYHK = utm_lonlat2xy(
        lonlatArray[i][0],
        lonlatArray[i][1],
        lon_orig,
        lat_orig
      );
      xyhkArray.push(xyhk);
    }
  }

  return xyhkArray;
}

/**
 * Calculates the max and min x-y coordinates
 * @param projName projection name
 * @return a map holding the min and max x, y coordinates
 */
function getCoordMinMax(projName: string): MinMax {
  const xyMinMax: MinMax = {};
  if (projName.includes("UTM")) {
    // for UTM projections origin latitude is always at the equator,
    // hence lat_orig is zero
    const lat_orig = 0;
    const lon_orig = getLonOriginUTM(projName);

    const minXY = utm_lonlat2xy(
      BOUND_CONS.minLon,
      BOUND_CONS.minLat,
      lon_orig,
      lat_orig
    );
    xyMinMax.minX = minXY.x;
    xyMinMax.minY = minXY.y;

    const maxXY = utm_lonlat2xy(
      BOUND_CONS.maxLon,
      BOUND_CONS.maxLat,
      lon_orig,
      lat_orig
    );
    xyMinMax.maxX = maxXY.x;
    xyMinMax.maxY = maxXY.y;
  }

  return xyMinMax;
}

/**
 * Calculates the scale projection-units/canvas units
 * @param projName projection name
 * @return a scale number
 */
function getScale(projName: string): number {
  const xyMinMax = getCoordMinMax(projName);

  let minX = xyMinMax.minX;
  let minY = xyMinMax.minY;
  let maxX = xyMinMax.maxX;
  let maxY = xyMinMax.maxY;

  const a = (APP_CONS.canvasWidth - APP_CONS.padding) / (maxX - minX);
  const b = (APP_CONS.canvasHeight - APP_CONS.padding) / (maxY - minY);

  return Math.min(a, b) * APP_CONS.scaleCoeff;
}

export { lonlat2xy, getScale };
