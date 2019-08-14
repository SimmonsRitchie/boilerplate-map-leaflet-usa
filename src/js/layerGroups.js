/* ---------------------------------------------------------------
                    MODULE: LAYER GROUPS
-----------------------------------------------------------------

Handles transformation of data to layergroups

*/

// --------------------------- IMPORTS ---------------------------

// third party
import * as topojson from "topojson"
const L = require('leaflet') // trying this

// my imports
import { titleCase } from "./parse"

// -------------------- TOPOJSON LAYER GROUP: STATES  ---------------------------

export const convertTopoJson = (topoJsonData) => {

  // EXTEND LEAFLET TO HANDLE TOPOJSON
  // Leaflet doesn't handle topoJson natively so we create a new class called 
  // TopoJSON which extends theGeoJSON class and overwrites its addData() method */
  L.TopoJSON = L.GeoJSON.extend({  
    addData: function(jsonData) {    
      if (jsonData.type === 'Topology') {
        for (let key in jsonData.objects) {
          const geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      }    
      else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }  
  });

  // CONVERT TOPOJSON DATA TO LAYER GROUP
  const layerGroup = new L.TopoJSON();
  layerGroup.addData(topoJsonData);

  // SET STYLE
  layerGroup.eachLayer(layer => {
    layer.setStyle({
      fillColor: 'none',
      color: '#555',
      weight: 0,
      opacity: 0
    });
  });

  return layerGroup
}

// -------------------- GEOJSON LAYER GROUP: SFF FACILITIES  -----------------------


export const convertGeoJson = (geoJsonData, colorScale) => {

  const layerGroup = L.geoJSON(geoJsonData, {
    style: function (feature) {
      return {
        fillOpacity: 1,
        fillColor: colorScale(feature.properties.status), // determine color from ColorScale
        color: 'black',
        weight: 0.1
      }
    },
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 3.5
      }
    )
    },
    onEachFeature: function(feature, layer) {
      if (feature.geometry.type==='Point') {
        const {
          PROVNAME,
          status,
          CITY,
          STATE
        } = feature.properties
        const provnameFormatted = titleCase(PROVNAME)
        const formattedStatus = status == "SFF" ? "Special Focus Facility" : "SFF Candidate"
        const cityFormatted = titleCase(CITY)
        const html = `
        <div"><strong>${provnameFormatted}</strong></div">
        <div>${formattedStatus}</div>
        <div>${cityFormatted}, ${STATE}</div>
        `
        layer.bindPopup(html)
      }
    }
  })
  return layerGroup
}

// -------------------- FILTER LAYER GROUP-----------------------


export const filterLayerGroup = (map, layer, filters) => {
  // this function is designed to be easy to expand with new filters
  // to create a new filter, add a new filter property at beginning of map.js
  // then adjust this function accordingly.

  // get props from layer
  const status = layer.feature.properties.status

  // Check if filter condition met:
  const statusFilter = filters.status.includes(status) ? true : false;
  
  // Return layer?
  if (statusFilter) {
    layer.addTo(map);
  } else {
    map.removeLayer(layer)
  }
}
