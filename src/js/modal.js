import { prototype } from "events";

/* ---------------------------------------------------------------
                    MODULE: MODAL
-----------------------------------------------------------------

A handcrafted modal. Element IDs need to be set upon instantiation. 

*/

export class Modal {

  constructor(modalContainerId, modalId, modalCloseButtonId, modalTextId, modalLoaderId) {
    // element IDs
    this.modalContainerId = modalContainerId;
    this.modalId = modalId;
    this.modalCloseButtonId = modalCloseButtonId;
    this.modalTextId = modalTextId;
    this.modalLoaderId = modalLoaderId;
    // selected elements
    this.modalContainerElem = document.getElementById(modalContainerId.substring(1)); // get modal element, remove # from string
    this.modalElem = document.getElementById(modalId.substring(1)); // get modal element, remove # from string
    this.modalTextElem = document.getElementById(modalTextId.substring(1))
    this.modalLoaderElem = document.getElementById(modalLoaderId.substring(1)); // get modal element, remove # from string
    // bind class methods so we can access them in other methods
    this.close = this.close.bind(this);
    this.disableLoadingIcon = this.disableLoadingIcon.bind(this);

  }

  open() {
    // const modalElem = document.getElementById(this.modalId.substring(1)); // get modal element, remove # from string
    this.modalContainerElem.setAttribute('style', 'display: flex') // make visible
    this.modalElem.addEventListener('click', () => { // add close event listener
      this.close()
    })
  }

  changeText(text) {
    this.modalTextElem.textContent = text
  }

  close() {
    this.disableLoadingIcon() // disable loading icon in case it's open
    this.modalContainerElem.setAttribute('style', 'display: none') // hide modal
  }

  enableLoadingIcon() {
    this.modalLoaderElem.setAttribute('style', 'display: flex') // visible
  }

  disableLoadingIcon() {
    this.modalLoaderElem.setAttribute('style', 'display: none') // invisible
  }
}