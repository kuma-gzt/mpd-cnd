"use strict";

// map constants
const MAP_CONS = {
  a: 6378137, // NAD83 ellipsoid
  e: 0.0818191910428,
  e2: 0.006694380022898204, // NAD83 ellipsoid
  e4: 4.4814723890978554e-5,
  e6: 3.000067923474657e-7,
  ep2: 0.006739496788262,
  ko: 0.9996, // UTM constant
  lccCentralMer: -91.8666666666667,
  lccLatOrig: 63.390675,
  lccLat1: 49,
  lccLat2: 77,
};

// app constants
const APP_CONS = {
  canvasWidth: 540, // canvas width in pixels
  canvasHeight: 480, // canvas height in pixels
  scaleCoeff: 0.00009,
  geogCoordSize: 116, //115
  padding: 20,
  lonRange: [-141, -133, -125, -117, -109, -101, -93, -85, -77, -69, -61, -53],
  latRange: [43, 51, 59, 67, 75, 83]
};

// boundary constants
const BOUND_CONS = {
  minLon: -141,
  minLat: 41,
  maxLon: -53,
  maxLat: 84,
};

// indicatrix colors
const IDX_COLORS = {
  40: "#a6cee3",
  41: "#1f78b4",
  42: "#b2df8a",
  43: "#33a02c",
  44: "#fb9a99",
  45: "#e31a1c",
  46: "#fdbf6f",
  47: "#ff7f00",
  48: "#cab2d6",
  49: "#6a3d9a",
  50: "#ffff99",
  51: "#b15928"
};

export { MAP_CONS, APP_CONS, BOUND_CONS, IDX_COLORS };
