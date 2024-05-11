"use strict";

import { BOUND_CONS, MAP_CONS } from "./constants.ts";
import { lcc_lonlat2xy } from "./lcc_proj.ts";

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
 * @param lon longitude
 * @return an array holding the x, y, h and k values
 */
function lonlat2xy(lonlatArray: ArrCoords, lat1: number, lat2: number): XYHKArray {
  const xyhkArray: XYHKArray = [];

  // using traditional for loop for better perfomance
  const arrLength = lonlatArray.length;
  for (let i = 0; i < arrLength; i++) {
    let xyhk: XYHK = lcc_lonlat2xy(
      lonlatArray[i][0],
      lonlatArray[i][1],
      MAP_CONS.lccCentralMer,
      MAP_CONS.lccLatOrig,
      lat1,
      lat2
    );
    xyhkArray.push(xyhk);
  }
  return xyhkArray;
}

/**
 * Calculates the max and min x-y coordinates
 * @param lon longitude
 * @return an object holding the min and max x, y coordinates
 */
function getCoordMinMax(lat1: number, lat2: number): MinMax {
  const xyMinMax: MinMax = {};

  const minXY = lcc_lonlat2xy(
    BOUND_CONS.minLon,
    BOUND_CONS.minLat,
    MAP_CONS.lccCentralMer,
    MAP_CONS.lccLatOrig,
    lat1,
    lat2
  );
  xyMinMax.minX = minXY.x;
  xyMinMax.minY = minXY.y;

  const maxXY = lcc_lonlat2xy(
    BOUND_CONS.maxLon,
    BOUND_CONS.maxLat,
    MAP_CONS.lccCentralMer,
    MAP_CONS.lccLatOrig,
    lat1,
    lat2
  );
  xyMinMax.maxX = maxXY.x;
  xyMinMax.maxY = maxXY.y;

  return xyMinMax;
}

export { lonlat2xy };
