

/* ---------------------------------------------------------------
                    MODULE: LEGEND
-----------------------------------------------------------------*/

/* This function draws a legend.

*/

// third party
import { select, selectAll } from "d3-selection"

// my imports
import { filterLayerGroup } from './layerGroups'

export const drawLegendHtml = (legendContainerClass, colorScale, keys, map, layerGroup) => {

  /*
  This function creates an HTML legend using D3.

  legendContainerClass: Required. String. Class name of div that will hold legend
  colorSCale: Required. d3 func. Determines color of dots and text labels based on keys.
  keys: Required. Array. Keys used for each of our labels. To use colorScale domain, use colorScale.domain()
  */

  // select the legend element
  const legend = select("." + legendContainerClass).append('div').attr('class','legend')

  // create group
  const legendLabelGroups = legend.selectAll("legend__labels")
    .data(keys)
    .enter()
    .append("g")
    .attr('class',"legend__labelGroup")

  // Add one dot to each group.
  legendLabelGroups
    .append('div')    
    .style('height', '15px')
    .style('width', '15px')
    .style('border-radius', '50%')
    .style('display', 'block')
    .style('background-color',d => colorScale(d))
    .attr('class','legend__dot')

  // add text label to each group.
  legendLabelGroups
    .append('span')    
      .html(d => d)
      .style('color', d => colorScale(d))
      .style('display', 'block')
      .attr('class','legend__label')

}

export function LegendGroupClickHandler (map, layerGroup, filters) {
  const legendLabelGroups = selectAll('.legend__labelGroup')

  legendLabelGroups.on('click', function(d, i) {
    const legendLabelGroup = select(this)
    const legendLabelValue = d
    const currentOpacity = legendLabelGroup.style('opacity')
    if (currentOpacity < 1) {
      // set opacity to 1 and add layers
      legendLabelGroup.style('opacity','1')
      filters.status.push(legendLabelValue)
      layerGroup.eachLayer((layer) => {
        filterLayerGroup(map, layer, filters)
      })
    } else {
      // reduce opacity and add remove
      legendLabelGroup.style('opacity','0.4')
      filters.status = filters.status.filter(filterItem => {
        if (filterItem !== legendLabelValue) {
          return filterItem
        }
      })
      layerGroup.eachLayer(function(layer) {
        filterLayerGroup(map, layer, filters)
      })
    }
  })
}


