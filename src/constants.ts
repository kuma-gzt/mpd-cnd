"use strict";

// map constants
const MAP_CONS = {
  a: 6378137, // NAD83 ellipsoid
  e: 0.0818191910428,
  e2: 0.006694380022898204, // NAD83 ellipsoid
  e4: 4.4814723890978554e-05,
  e6: 3.000067923474657e-07,
  ep2: 0.006739496788262,
  ko: 0.9996, // UTM constant
};

// app constants
const APP_CONS = {
  canvasWidth: 600, // canvas width in pixels
  canvasHeight: 504, // canvas height in pixels // height/width = 1.19
  padding: 0, // padding in pixels 30
  scaleCoeff: 1.8, // scale coefficient 0.8
};

// boundary constants
const BOUND_CONS = {
  minLon: -144, //-141.0023496000000023,
  minLat: 0, //41.6765555999999719,
  maxLon: -54, //-52.6728133999999955,
  maxLat: 90 //83.1188918999999942,
};

// canvas center shift coords
const CANVAS_CONS = {

};

export { MAP_CONS, APP_CONS, BOUND_CONS };
