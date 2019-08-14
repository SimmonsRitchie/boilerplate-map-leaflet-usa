/* ---------------------------------------------------------------
                    MODULE: LOADER
-----------------------------------------------------------------*/

/* Handles loader loader

*/

export class Loader {

  constructor(loaderId) {
    this.loaderElem = document.getElementById(loaderId.substring(1))
  }

  start() {
    this.loaderElem.setAttribute('style', 'display: flex')
  }

  stop() {
    this.loaderElem.setAttribute('style', 'display: none')
  }
}
