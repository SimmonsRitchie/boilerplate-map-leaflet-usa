
/* ---------------------------------------------------------------
                    BOILERPLATE - LEAFLET MAP
/* ---------------------------------------------------------------

A leaflet map that adds color-coded circleMarkers from geoJson data

*/


// --------------------------- IMPORTS ---------------------------

// Third party
import {select} from 'd3-selection'
import debounce from 'debounce';

// My imports
import { Loader } from './loader'
import { loadAndProcessData, fetchTest } from "./loadAndProcessData";
import { drawMap } from './map';

// --------------------------- CANVAS SETUP AND BASIC PROPS ---------------------------

  // SET BASIC PROPS
  const breakpointSmallScreen = 400;

  // SET ELEMENT PROPS
  const mapContainerClass = 'graphic__map'
  const legendContainerClass = 'container__legend' // don't include . with class name
  const graphicInner = select(".graphic__inner");
  const loaderId = '#container__loader'

  // STORE PROPS
  const props = {
    mapContainerClass,
    legendContainerClass,
    graphicInner,
    breakpointSmallScreen
  }

// --------------------------- LOADING ICON ---------------------------

const loader = new Loader(loaderId)
loader.start()

// --------------------------- LOAD DATA AND DRAW GRAPHIC ---------------------------

loadAndProcessData().then(rawData => {

  // --------------------------- RESIZE ---------------------------

  // actions to perform when screen resizes
  function resize() {
    pymChild.sendHeight(); // updates height if graphic is being displayed in iframe
  }

  // ------------------------------------- INIT ----------------------------------
  
  // Sets up our map + event listeners when page loads
  function init() {
    loader.stop()
    drawMap(rawData, props)
    // add event listner for any resizes (listener is debounced)
    window.addEventListener("resize", debounce(resize, 200));
  }

  // ------------------------------------- START ----------------------------------

  init()

});



