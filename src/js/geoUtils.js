/* ---------------------------------------------------------------
                    MODULE: GEO UTILS
-----------------------------------------------------------------

Module for geographic functions that are useful for mapping

*/

// Third party imports
import * as turf from '@turf/turf'
const L = require('leaflet') // trying this


// -------------------- POINT WITHIN POLYGON  ---------------------------

// Using turf to checking whether point is within given geographic area

export const checkPointWithinGeography = (inputLat, inputLng, layerGroup) => {
  // Convert input into Turf point
  const turfPoint = turf.point([inputLng, inputLat]); // NOTE: turf takes [lng, lat] format. leaflet takes [lat, lng].
  // Declare vars here so they're in scope throughout function
  let stateName = null;
  let stateCoords = null;
  let stateLatLng = null;
  let stateBounds = null;
  // Loop through each layer
  layerGroup.eachLayer( layer => {
    const layerCoords = layer.feature.geometry.coordinates;
    // Detecting if layer is multiline polygon. If it is, then handle loop through each of its sub-arrays to check whether
    // point is within those coords.
    if (layerCoords[0].length === 1) {
      layer.feature.geometry.coordinates.forEach((coords) => {
        const turfPoly = turf.polygon(coords);
        const pointWithinPoly = turf.booleanPointInPolygon(turfPoint, turfPoly);
        if (pointWithinPoly) {
          stateName = layer.feature.properties.NAME;
          stateCoords = layerCoords;
          stateLatLng = layer._latlngs;
          stateBounds = layer._bounds;
        }
      })
    } else {
      const turfPoly = turf.polygon(layerCoords);
      const pointWithinPoly = turf.booleanPointInPolygon(turfPoint, turfPoly);
      if (pointWithinPoly) {
        stateName = layer.feature.properties.NAME;
        stateCoords = layerCoords;
        stateLatLng = layer._latlngs;
        stateBounds = layer._bounds;
      }      
    }
  })
  return {
    stateName,
    stateCoords,
    stateLatLng,
    stateBounds,
    exactLocation: [inputLat, inputLng],
  }
}

