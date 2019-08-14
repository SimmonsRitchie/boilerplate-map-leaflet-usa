/* ---------------------------------------------------------------
                    MODULE: LOAD AND PROCESS
-----------------------------------------------------------------*/
/*
This module gets out data and parses it if necesary
*/

// --------------------------- IMPORTS ---------------------------

// Third party
import { csv, json, tsv } from "d3-fetch"; // I'm using d3-fetch instead of d3-request because this tutorial is using V5 API
import { scaleOrdinal } from "d3-scale";

// My imports
import {formatData, multipleColumnsToSeries} from './parse'
import moment from "moment";

export const loadAndProcessData = () =>
  // GETTING DATA USING PROMISE ALL
  // Promise all gets all data before continuing
  Promise.all([
    json("static/sff_list_geocoded.json"),
    json("static/us-states-500k-topo-highquality.json"),
  ]).then(([sffList, states]) => {

    // DATA GROUPS: SET META DATA
    // Each data group represents all X and Y values being displayed on the graph at a single time.
    // Below we define an object with metadata and processing info for each group. We create this so we only have to adjust things
    // here when we load in different data.
    // NOTE: props in the first object in array may not be redundant because they're mapped on with the chained function,
    // however, we leave them here as an easy reference to the props we can apply.
    const dataGroups = [
      {
      "groupLabel":"sffList", // Required: data label
      "data": sffList, // Required: imported data
    },
      {
      "groupLabel":"states", // Required: data label
      "data": states, // Required: imported data
    },
  ]
    // PARSING DATA GROUPS
    // Loop over our datagroups and parse the 'data' payload if needed.
    const dataReady = {}
    for (var i = 0, len = dataGroups.length; i < len; i++) {
      dataReady[dataGroups[i].groupLabel] = dataGroups[i]
    }
    return dataReady;
}).catch(error => console.log(error));


export const add = (x) => {
  const scale = scaleOrdinal()
  return x + 5
}

export const fetchTest = () => fetch('static/dummy.json')
.then(res => res.json())
.then(json => console.log(json))
.catch(error => console.error(error))