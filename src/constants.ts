"use strict";

// map constants
const MAP_CONS = {
  a: 6378137, // NAD83 ellipsoid
  e2: 0.006694380035513, // NAD83 ellipsoid
  e4: 4.48147240598725e-5,
  e6: 3.00006794043427e-7,
  ep2: 0.006739496788262,
  ko: 0.9996, // UTM constant
};

// app constants
const APP_CONS = {
  canvasWidth: 800, // canvas width in pixels
  canvasHeight: 800, // canvas height in pixels
  padding: 30, // padding in pixels
  scaleCoeff: 0.96, // scale coefficient
};

// boundary constants
const BOUND_CONS = {
  minLon: -141.0023496000000023,
  minLat: 41.6765555999999719,
  maxLon: -52.6728133999999955,
  maxLat: 83.1188918999999942,
};

export { MAP_CONS, APP_CONS, BOUND_CONS };
