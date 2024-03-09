"use strict";

interface XYHK {
  x: number;
  y: number;
  h: number;
  k: number;
}

// app constants
const appCons = new Map();
appCons.set("canvasWidth", 800); // canvas width in pixels
appCons.set("canvasHeight", 800); // canvas height in pixels
appCons.set("padding", 30); // padding in pixels
appCons.set("scaleCoeff", 0.96); // scale coefficient

// mathematical constants
const mathCons = new Map();
mathCons.set("a", 6378137); // NAD83 ellipsoid
mathCons.set("e2", 0.006694380035513); // NAD83 ellipsoid
mathCons.set("e4", 4.48147240598725e-5);
mathCons.set("e6", 3.00006794043427e-7);
mathCons.set("ep2", 0.006739496788262);
mathCons.set("ko", 0.9996); // UTM constant

// boundary constants
const boundCons = new Map();
boundCons.set("minLon", -141.0023496000000023);
boundCons.set("minLat", 41.6765555999999719);
boundCons.set("maxLon", -52.6728133999999955);
boundCons.set("maxLat", 83.1188918999999942);

/**
 * Converts degrees to radians
 * @param degree
 * @return degree in radians
 */
function radians(degree: number) {
  return (degree * Math.PI) / 180;
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

/**
 * Calculates the x-y UTM coordinates and the h-k scales
 * @param lon longitude in degrees
 * @param lat latitude in degrees
 * @param lon_orig origin longitude in degrees
 * @param lat_orig origin latitude in degrees
 * @return an object holding the x, y, h and k values
 */
function utm_latlon2xy(
  lon_: number,
  lat_: number,
  lon_orig: number,
  lat_orig: number
) {
  const lat = radians(lat_);
  const lon = radians(lon_);
  const latO = radians(lat_orig);
  const lonO = radians(lon_orig);
  const a = mathCons.get("a");
  const e2 = mathCons.get("e2");
  const e4 = mathCons.get("e4");
  const e6 = mathCons.get("e6");
  const ep2 = mathCons.get("ep2");
  const ko = mathCons.get("ko");

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

  const xy: XYHK = {
    x: x,
    y: y,
    h: h,
    k: k,
  };
  
  return xy;
}

/**
 * Calculates the x-y coordinates from lon lat coordinates
 * @param lonlatArray array of lons and lats
 * @param projName projection name
 * @return an array holding the x, y, h and k coordinates
 */
function lonlat2xy(lonlatArray: [], projName: string) {
  const xyhkArray = [];

  if (projName.includes("UTM")) {
    // for UTM projections origin latitude is always at the equator,
    // hence lat_orig is zero
    const lat_orig = 0;
    const lon_orig = getLonOriginUTM(projName);

    for (const item of lonlatArray) {
      const xyhk = utm_latlon2xy(item[0], item[1], lon_orig, lat_orig);
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
function getCoordMinMax(projName: string) {
  const xyMinMax = new Map();
  
  if (projName.includes("UTM")) {
    // for UTM projections origin latitude is always at the equator,
    // hence lat_orig is zero
    const lat_orig = 0;
    const lon_orig = getLonOriginUTM(projName);

    const minXY = utm_latlon2xy(
      boundCons.get("minLon"),
      boundCons.get("minLat"),
      lon_orig,
      lat_orig
    );
    xyMinMax.set("minX", minXY.x);
    xyMinMax.set("minY", minXY.y);

    const maxXY = utm_latlon2xy(
      boundCons.get("maxLon"),
      boundCons.get("maxLat"),
      lon_orig,
      lat_orig
    );
    xyMinMax.set("maxX", maxXY.x);
    xyMinMax.set("maxY", maxXY.y);
  }

  return xyMinMax;
}

/**
 * Calculates the max and min x-y coordinates
 * @param projName projection name
 * @return a map holding the min and max x, y coordinates
 */
function getScale(xyhk: XYHK[][], projName: string) {
  const xyMinMax = getCoordMinMax(projName);

  let minX = xyMinMax.get("minX");
  let minY = xyMinMax.get("minY");
  let maxX = xyMinMax.get("maxX");
  let maxY = xyMinMax.get("maxY");

  const a =
    (appCons.get("canvasWidth") - appCons.get("padding")) / (maxX - minX);

  const b =
    (appCons.get("canvasHeight") - appCons.get("padding")) / (maxY - minY);

  return Math.min(a, b) * appCons.get("scaleCoeff");
}

export { lonlat2xy, getScale };
