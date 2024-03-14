"use strict";

import { MAP_CONS } from "./constants.ts";
import { toRadians } from "./util_functions.ts";

interface XYHK {
  x: number;
  y: number;
  h: number;
  k: number;
}

/**
 * Calculates the x-y UTM coordinates and the h-k scales
 * @param lon_ longitude in degrees
 * @param lat_ latitude in degrees
 * @param lon_orig origin longitude in degrees
 * @param lat_orig origin latitude in degrees
 * @return an object holding the x, y, h and k values
 */
function utm_lonlat2xy(
  lon_: number,
  lat_: number,
  lon_orig: number,
  lat_orig: number
) {
  const lat = toRadians(lat_);
  const lon = toRadians(lon_);
  const latO = toRadians(lat_orig);
  const lonO = toRadians(lon_orig);

  const a = MAP_CONS.a;
  const e2 = MAP_CONS.e2;
  const e4 = MAP_CONS.e4;
  const e6 = MAP_CONS.e6;
  const ep2 = MAP_CONS.ep2;
  const ko = MAP_CONS.ko;

  const N = a / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
  const T = Math.pow(Math.tan(lat), 2);
  const C = ep2 * Math.pow(Math.cos(lat), 2);
  const A = (lon - lonO) * Math.cos(lat);
  const M =
    a *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * lat -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * lat) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * lat) -
      ((35 * e6) / 3072) * Math.sin(6 * lat));
  /* double Mo = a*((1 - e2/4.0 - 3*e4/64.0 - 5*e6/256.0)*lat_o - (3*e2/8.0 + 3*e4/32.0 + 45*e6/1024.0)*Math.sin(2*lat_o) +
    (15*e4/256.0 + 45*e6/1024.0)*Math.sin(4*lat_o) - (35*e6/3072.0)*Math.sin(6*lat_o)); */
  const Mo = 0;

  // x, y coords
  const x =
    ko *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6.0 +
        ((5 - 18 * T + Math.pow(T, 2) + 72 * C - 58 * ep2) * Math.pow(A, 5)) /
          120) +
    500000;
  const y =
    ko *
    (M -
      Mo +
      N * Math.tan(lat) * (Math.pow(A, 2) / 2) +
      ((5 - T + 9 * C + 4 * Math.pow(C, 2)) * Math.pow(A, 4)) / 24.0 +
      ((61 - 58 * T + Math.pow(T, 2) + 600 * C - 330 * ep2) * Math.pow(A, 6)) /
        720);

  // h, k scales
  const k =
    ko *
    (1 +
      ((1 + C) * A * A) / 2 +
      ((5 - 4 * T + 42 * C + 13 * C * C - 28 * ep2) * Math.pow(A, 4)) / 24 +
      ((61 - 14 * T + 16 * T * T) * Math.pow(A, 6)) / 720);
  const h = k; // h == k for Transeverse Mercator

  const xyhk: XYHK = {
    x: x,
    y: y,
    h: h,
    k: k,
  };

  return xyhk;
}

/**
 * Gets the longitude origin in degrees for UTM projections
 * @param utmZone
 * @return origin longitude in degrees
 */
function getLonOriginUTM(utmZone: string) {
  let lonOrig: number;

  switch (utmZone) {
    case "UTM Z7":
      lonOrig = -141;
      break;
    case "UTM Z8":
      lonOrig = -135;
      break;
    case "UTM Z9":
      lonOrig = -129;
      break;
    case "UTM Z10":
      lonOrig = -123;
      break;
    case "UTM Z11":
      lonOrig = -117;
      break;
    case "UTM Z12":
      lonOrig = -111;
      break;
    case "UTM Z13":
      lonOrig = -105;
      break;
    case "UTM Z14":
      lonOrig = -99;
      break;
    case "UTM Z15":
      lonOrig = -93;
      break;
    case "UTM Z16":
      lonOrig = -87;
      break;
    case "UTM Z17":
      lonOrig = -81;
      break;
    case "UTM Z18":
      lonOrig = -75;
      break;
    case "UTM Z19":
      lonOrig = -69;
      break;
    case "UTM Z20":
      lonOrig = -63;
      break;
    case "UTM Z21":
      lonOrig = -57;
      break;
    case "UTM Z22":
      lonOrig = -51;
      break;
    default:
      lonOrig = 0;
      console.log("No origin longitude for given UTM zone");
      break;
  }

  return lonOrig;
}

export { utm_lonlat2xy, getLonOriginUTM };
