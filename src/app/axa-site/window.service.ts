import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowService {

  private draggingStatus: boolean;

  private firstCountry: any = null;

  private secondCountry: any = null;

  constructor() { }

  get nativeWindow (): any {
    return getWindow();
  }

  setDraggingStatus(status) {
    this.draggingStatus = status;
  }

  getDraggingStatus() {
    return this.draggingStatus;
  }

  getFirstCountry() {
    return this.firstCountry;
  }

  setFirstCountry(country) {
    this.firstCountry = country;
  }

  getSecondCountry() {
    return this.secondCountry;
  }

  setSecondCountry(country) {
    this.secondCountry = country;
  }

  comparisonGoingOn() {
    return this.firstCountry !== null && this.secondCountry !== null;
  }


}
