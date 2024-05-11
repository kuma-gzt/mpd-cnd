"use strict";

import { geogCoord } from "./canvec_15.ts";
import { lonlat2xy } from "./map_proj_equations.ts";
import { APP_CONS, MAP_CONS } from "./constants.ts";

interface XYHK {
  x: number;
  y: number;
  h: number;
  k: number;
}

interface XYHK_PRV {
  prv: string;
  xyhk: XYHK;
}

/**
 * Main function to be exported
 * @param projName projection name
 * @return the canvas point coordinates
 */
function getCanvasCoords(lat1: number, lat2: number) {
  // min x, y map coordinates
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  function addGraticule() {
    const geogCoordLength = geogCoord.features.length;
    geogCoordLength > APP_CONS.geogCoordSize
      ? (geogCoord.features.length = APP_CONS.geogCoordSize)
      : undefined;

    // standard parallel 1
    const stanPara1 = {
      prv: "stanPara1",
      geom: {
        coord: [
          [
            [
              [-121, lat1],
              [-120, lat1],
              [-119, lat1],
              [-118, lat1],
              [-117, lat1],
              [-116, lat1],
              [-115, lat1],
              [-114, lat1],
              [-113, lat1],
              [-112, lat1],
              [-111, lat1],
              [-110, lat1],
              [-109, lat1],
              [-108, lat1],
              [-107, lat1],
              [-106, lat1],
              [-105, lat1],
              [-104, lat1],
              [-103, lat1],
              [-102, lat1],
              [-101, lat1],
              [-100, lat1],
              [-99, lat1],
              [-98, lat1],
              [-97, lat1],
              [-96, lat1],
              [-95, lat1],
              [-94, lat1],
              [-93, lat1],
              [-92, lat1],
              [-91, lat1],
              [-90, lat1],
              [-89, lat1],
              [-88, lat1],
              [-87, lat1],
              [-86, lat1],
              [-85, lat1],
              [-84, lat1],
              [-83, lat1],
              [-82, lat1],
              [-81, lat1],
              [-80, lat1],
              [-79, lat1],
              [-78, lat1],
              [-77, lat1],
              [-76, lat1],
              [-75, lat1],
              [-74, lat1],
              [-73, lat1],
              [-72, lat1],
              [-71, lat1],
              [-70, lat1],
              [-69, lat1],
              [-68, lat1],
              [-67, lat1],
              [-66, lat1],
              [-65, lat1],
              [-64, lat1],
              [-63, lat1],
            ],
          ],
        ],
      },
    };

    // standard parallel 2
    const stanPara2 = {
      prv: "stanPara2",
      geom: {
        coord: [
          [
            [
              [-116, lat2],
              [-115, lat2],
              [-114, lat2],
              [-113, lat2],
              [-112, lat2],
              [-111, lat2],
              [-110, lat2],
              [-109, lat2],
              [-108, lat2],
              [-107, lat2],
              [-106, lat2],
              [-105, lat2],
              [-104, lat2],
              [-103, lat2],
              [-102, lat2],
              [-101, lat2],
              [-100, lat2],
              [-99, lat2],
              [-98, lat2],
              [-97, lat2],
              [-96, lat2],
              [-95, lat2],
              [-94, lat2],
              [-93, lat2],
              [-92, lat2],
              [-91, lat2],
              [-90, lat2],
              [-89, lat2],
              [-88, lat2],
              [-87, lat2],
              [-86, lat2],
              [-85, lat2],
              [-84, lat2],
              [-83, lat2],
              [-82, lat2],
              [-81, lat2],
              [-80, lat2],
              [-79, lat2],
              [-78, lat2],
              [-77, lat2],
              [-76, lat2],
              [-75, lat2],
              [-74, lat2],
              [-73, lat2],
              [-72, lat2],
              [-71, lat2],
              [-70, lat2],
              [-69, lat2],
              [-68, lat2],
            ],
          ],
        ],
      },
    };

    // central meridian
    const centralMerid = {
      prv: "centralMerid",
      geom: {
        coord: [
          [
            [
              [MAP_CONS.lccCentralMer, 41],
              [MAP_CONS.lccCentralMer, 84],
            ],
          ],
        ],
      },
    };

    geogCoord.features.push(stanPara1, stanPara2, centralMerid);
  }

  function getXYHK_PRV(): XYHK_PRV[] {
    const xyhk_prv = [];

    addGraticule();

    // using traditional for loop for better perfomance
    const geogCoordLength = geogCoord.features.length;
    for (let i = 0; i < geogCoordLength; i++) {
      const tmp = lonlat2xy(geogCoord.features[i].geom.coord[0][0], lat1, lat2);

      // using traditional for loop for better perfomance
      const tmpLength = tmp.length;
      for (let j = 0; j < tmpLength; j++) {
        tmp[j].x = tmp[j].x * APP_CONS.scaleCoeff;
        tmp[j].y = tmp[j].y * APP_CONS.scaleCoeff * -1;

        if (tmp[j].x < minX) minX = tmp[j].x;
        if (tmp[j].y < minY) minY = tmp[j].y;
      }

      xyhk_prv.push({ prv: geogCoord.features[i].prv, xyhk: tmp });
    }

    return xyhk_prv;
  }

  function getXYHK_PRV_Canvas(xyhk_prv: XYHK_PRV[]) {
    const tx = minX * -1;
    const ty = minY * -1;

    // using traditional for loop for better perfomance
    const xyhk_prvLength = xyhk_prv.length;
    for (let i = 0; i < xyhk_prvLength; i++) {
      const tmp_ = xyhk_prv[i].xyhk;
      const tmpLength_ = xyhk_prv[i].xyhk.length;
      for (let j = 0; j < tmpLength_; j++) {
        tmp_[j].x = tmp_[j].x + tx + APP_CONS.padding;
        tmp_[j].y = tmp_[j].y + ty + APP_CONS.padding;
      }
    }

    return xyhk_prv;
  }

  const xyhk_prv = getXYHK_PRV();
  const canvasPoints = getXYHK_PRV_Canvas(xyhk_prv);

  return canvasPoints;
}

export { getCanvasCoords };
