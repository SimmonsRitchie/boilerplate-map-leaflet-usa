
/* ---------------------------------------------------------------
                    MODULE: MAP
-----------------------------------------------------------------*/

/* This function draws the map.

NOTE: Remember, when using coordinates:
  - GIS, data formats, developer tools = LONG, LAT (like Turf) <---- non-traditional way to ref coordinates
  - End-user-ish-things = LAT, LONG (like Leaflet) <---- traditional way to ref coordinates
*/

// --------------------------- IMPORTS ---------------------------

// Third party
// import 'leaflet.markercluster'
import { drawLegendHtml, LegendGroupClickHandler } from "./legend";
import { scaleOrdinal } from "d3-scale";
// import L from 'leaflet' // commenting out because of problems importing leaflet
const L = require('leaflet')

// My imports
import { titleCase } from "./parse"
import { Modal } from "./modal"
import { convertTopoJson, convertGeoJson } from './layerGroups'
import { checkPointWithinGeography } from "./geoUtils"

// --------------------------- DRAW CHART ---------------------------

export const drawMap = (rawData, props) => {

  //-------------------- SET UP ------------------------

  // GET DESIRED DATA
  const dataSff = rawData.sffList.data // geoJSON of points
  const dataStates = rawData.states.data // topoJSON of US state boundaries

  // DESTRUCTURE PROPS
  const {
    mapContainerClass,
    legendContainerClass,
    graphicInner,
    breakpointSmallScreen,
  } = props;


  // MODAL INIT
  const modalContainerId = '#container__modal'
  const modalId = '#modal'
  const modalCloseButtonId = '#modal__close'
  const modalTextId = '#modal__text'
  const modalLoaderId = '#modal__loader-container'
  const modal = new Modal(modalContainerId, modalId, modalCloseButtonId, modalTextId, modalLoaderId)

  // RESPONSIVE: GET WIDTH
  // We get width of graphicInner and then pass it into render to get our svg width
  const width = graphicInner.node().offsetWidth;

  // CONTINENTAL USA BOUNDS
  const continentalUsaBounds = L.latLngBounds(
    L.latLng(49, -120), //northwest
    L.latLng(24, -81)  //Northeast
  );

  // COLOR SCALE FOR LEGEND + MAP ICONS
  const colorScale = scaleOrdinal()
    .range([
      "#E6842A",
      '#E3BA22'
  ])
    .domain([
      'SFF',
      'SFF Candidate',
  ])

  // LAYER FILTERS
  // values present in filters object will be returned to map, values not present will be filtered out 
  let filters = {
    status : colorScale.domain()
  }

  //-------------------- INIT MAP ------------------------

  // INIT MAP
  // We set default location and zoom level here
  // location: center of Pa.
  const map = L.map(mapContainerClass)
    .fitBounds(continentalUsaBounds)

  // ADD BASEMAP
  // Carto DB Positron
  const layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
  }).addTo(map)

  //-------------------- ADD LAYER GROUP: STATE BOUNDARIES ------------------------

  // ADD GEO JSON LAYER OF POINTS
  const layerGroupStates = convertTopoJson(dataStates)
  layerGroupStates.addTo(map);
  
  //-------------------- ADD LAYER GROUP: SFF LOCATIONS ------------------------

  // ADD GEO JSON LAYER OF POINTS
  const layerGroupSff = convertGeoJson(dataSff, colorScale)
  layerGroupSff.addTo(map)

  //-------------------- EVENT: CHANGE MARKER SIZE ------------------------

  // ON ZOOM: CHANGE MARKER SIZE
  /* Because circleMarkers can be difficult to click on mobile we
  resize them as we zoom in. */
  map.on('zoomend', (e) => {
    var currentZoom = map.getZoom();
    const radiusMultiplier = 1
    let radius = currentZoom * radiusMultiplier
    layerGroupSff.setStyle({
      radius
    })
  });

  //-------------------- EVENT: GEOLOCATE ------------------------

  // GEOLOCATION 
  const geolocate = () => {

    // Check if geolocation functionality is available to client
    // GEOLOCATION AVAILABLE:
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(

      // SUCCESS
      (position) => {
        const userLat = position.coords.latitude
        const userLong = position.coords.longitude
        const {stateName, stateCoords, stateLatLng, stateBounds} = checkPointWithinGeography(userLat, userLong, layerGroupStates)
        if (stateBounds) {
          modal.close()
          if (stateName === 'Alaska') {
            // Handling bug: Because the long of Alaska's furtherest westerly point come close to the antimeridian leaflet can't seem to properly fit bounds
            // instead, zoom on Anchorage.
            const anchorageCoords = [61.2181, -149.9003] // note: in lng, lat format
            map.setView(anchorageCoords, 4);
          } else {
            map.fitBounds(stateBounds, { // zoom to state
              // maxZoom: 10
            })
          }
        } else {
          modal.disableLoadingIcon()
          modal.changeText("Sorry! You appear to be outside of the U.S.")
        }
      }, 
      // ERROR
      (err) => {
        modal.open()
        modal.disableLoadingIcon()
        if (err.code == 1) {
          modal.changeText("Sorry! You need to enable geolocation for that to work.")
        } else {
          modal.changeText("Sorry! We couldn't find your location.")
        }
      },
      // OPTIONS
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 0
      })
    // GEOLOCATION UNAVAILABLE:
    } else {
      modal.open()
      modal.changeText("Geolocation is unavailable on your browser.")
    }
  }


  // EVENT LISTENER - YOUR LOCATION BUTTON
  const geolocationButton = document.getElementById('action__geolocation')
  geolocationButton.addEventListener('click', () => {
    modal.open()
    modal.changeText("Searching for your location...")
    modal.enableLoadingIcon()
    geolocate()
  })


  //-------------------- EVENT: FULL MAP VIEW ------------------------

  // ZOOM OUT FUNC
  const zoomOut = () => {
    var mainView = L.latLngBounds(continentalUsaBounds);
    map.fitBounds(mainView, {
      // maxZoom: 10
    });
  }
  const fullMapButton = document.getElementById('action__full-map')
  fullMapButton.addEventListener('click', () => {
      modal.close()
      zoomOut()
  });


  //-------------------- DRAW LEGEND ------------------------
  
  // We create an html legend for the map icons
  const keys = colorScale.domain()
  drawLegendHtml(legendContainerClass, colorScale, keys, map, layerGroupSff)

  LegendGroupClickHandler(map, layerGroupSff, filters)


  //-------------------- UPDATE IFRAME ------------------------

  // pymChild sends the height to pym script in iframe, we do this because
  // table height changes based on user interaction.
  pymChild.sendHeight();

}