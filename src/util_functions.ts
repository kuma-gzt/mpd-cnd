"use strict";

/**
 * Converts degrees to radians
 * @param degree
 * @return degree in radians
 */
function toRadians(degree: number): number {
  return (degree * Math.PI) / 180;
}

export { toRadians };
