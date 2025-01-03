// src/services/h3.js
import { geoToH3 } from 'h3-js';

export function getH3Cell(lat, lon, resolution = 9) {
  // resolution parameter determines cell size 
  // (lower resolution = larger cells)
  return geoToH3(lat, lon, resolution);
}
