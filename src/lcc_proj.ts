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
 * Calculates the x-y LCC coordinates and the h-k scales
 * @param lon longitude in degrees
 * @param lat latitude in degrees
 * @param lon0 origin longitude in degrees
 * @param lat0 origin latitude in degrees
 * @param lat1 first standard parallel
 * @param lat2 second standard parallel
 * @return an object holding the x, y, h and k values
 */
function lcc_lonlat2xy(
  lon_: number,
  lat_: number,
  lon0_: number,
  lat0_: number,
  lat1_: number,
  lat2_: number
): XYHK {
  const lat = toRadians(lat_);
  const lon = toRadians(lon_);
  const lat0 = toRadians(lat0_);
  const lon0 = toRadians(lon0_);
  const lat1 = toRadians(lat1_);
  const lat2 = toRadians(lat2_);

  const a = MAP_CONS.a;
  const e = MAP_CONS.e;
  const e2 = MAP_CONS.e2;
  const m1 =
    Math.cos(lat1) / Math.sqrt(1 - e2 * Math.sin(lat1) * Math.sin(lat1));
  const m2 =
    Math.cos(lat2) / Math.sqrt(1 - e2 * Math.sin(lat2) * Math.sin(lat2));
  const t = get_t(lat, e);
  const t1 = get_t(lat1, e);
  const t2 = get_t(lat2, e);
  const t0 = get_t(lat0, e);
  const n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
  const F = m1 / (n * Math.pow(t1, n));
  const rho_0 = a * F * Math.pow(t0, n);

  const rho = a * F * Math.pow(t, n);
  const theta = n * (lon - lon0);

  const x = rho * Math.sin(theta);
  const y = rho_0 - rho * Math.cos(theta);

  const m = Math.cos(lat) / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
  const k = (rho * n) / (a * m);

  const xyhk: XYHK = {
    x: x,
    y: y,
    h: k, //k = h for conformal projections
    k: k,
  };

  return xyhk;
}

/**
 * Calculates the t parameter
 * @param lat latitude in radians
 * @param e eccentricity
 * @return a number the t parameter
 */
function get_t(lat: number, e: number) {
  const A = Math.tan(Math.PI / 4 - lat / 2);
  const B = 1 - e * Math.sin(lat);
  const C = 1 + e * Math.sin(lat);

  return A / Math.pow(B / C, e / 2);
}

export { lcc_lonlat2xy };
