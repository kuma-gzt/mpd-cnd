"use strict";

import { geogCoord } from "./canvec_15.ts";
import { lonlat2xy, getScale } from "./map_proj_equations.ts";

/* let minX = Number.MAX_VALUE;
let minY = Number.MAX_VALUE;

let lonlat = [];

const geogCoordLength = geogCoord.features.length;

for (let i = 0; i < geogCoordLength; i++){
  lonlat.push(geogCoord.features[i].geom.coord[0][0])
}

let xyhk = [];
const lonlatLength = lonlat.length;

for (let i = 0; i < lonlatLength; i++){
  xyhk.push(lonlat2xy(lonlat[i], "UTM Z22"))
}

const scale_ = getScale(xyhk, "UTM Z22") */

let minX = Number.MAX_VALUE;
let minY = Number.MAX_VALUE;

/**
 * Calculates the xyhk array from the canvec_t15 geojson
 * @param projName projection name
 * @return xyhk as an array
 */
function getXyhk(projName: string) {

  let lonlat = [];

  const geogCoordLength = geogCoord.features.length;

  for (let i = 0; i < geogCoordLength; i++){
    lonlat.push(geogCoord.features[i].geom.coord[0][0])
  }
  
  let xyhk = [];
  const lonlatLength = lonlat.length;
  
  for (let i = 0; i < lonlatLength; i++){
    xyhk.push(lonlat2xy(lonlat[i], projName))
  }
  
  return xyhk;
}


//TODO continue here the getXyhk function should be called inmain becuase it's in main
// that we select the projection

// same with below that still wasn't grouped in a function
//const xyhk = getXyhk("UTM Z22")

//scale = getScale(xyhk, projName)



/* let points_ = []
const xyhkLength = xyhk.length;

for (let i = 0; i < xyhkLength; i++){
  let tmp = []
  let iLength = xyhk[i].length
  for (let j = 0; j < iLength; j++){
    // y coordinate is multiplied by (-1) to flip on the x axis
    tmp.push([xyhk[i][j].x*scale_, xyhk[i][j].y*scale_*-1])
  }
  
  const tmpLen = tmp.length;
  for (let j = 0; j < tmpLen; j++){
    let x = tmp[j][0];
    let y = tmp[j][1];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
  }
  points_.push(tmp)
}
console.log(points_)

const tx = minX*-1
const ty = minY*-1
const points_Length = points_.length;
let points = []

for (let i = 0; i < points_Length; i++){
  let arr = points_[i]
  let tmp = []
  for (let j = 0; j < arr.length; j++){
    tmp.push([arr[j][0] + tx + 15, arr[j][1] + ty + 15])
  }
  points.push(tmp)
} */



function getPreDrawingPoints(xyhk:any, scale:number){
  let points = []

  const xyhkLength = xyhk.length;
  for (let i = 0; i < xyhkLength; i++){
    let tmp = []
    const iLength = xyhk[i].length    
    for (let j = 0; j < iLength; j++){
      // y coordinate is multiplied by (-1) to flip on the x axis
      tmp.push([xyhk[i][j].x*scale, xyhk[i][j].y*scale*-1])
    }
    
    const tmpLen = tmp.length;
    for (let j = 0; j < tmpLen; j++){
      let x = tmp[j][0];
      let y = tmp[j][1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
    }

    points.push(tmp)
  }

  return points
}

//console.log(points_)

function getDrawingPoints(points:any){
  let drawingPoints = []
  // let minX = Number.MAX_VALUE;
  // let minY = Number.MAX_VALUE;
  
  const tx = minX*-1
  const ty = minY*-1

  const pointsLength = points.length;
  for (let i = 0; i < pointsLength; i++){
    let arr = points[i]
    let tmp = []

    const arrLength = arr.length;
    for (let j = 0; j < arrLength; j++){
      tmp.push([arr[j][0] + tx + 15, arr[j][1] + ty + 15])
    }
    drawingPoints.push(tmp)
  }

  return drawingPoints
}



export { getXyhk, getPreDrawingPoints, getDrawingPoints};
