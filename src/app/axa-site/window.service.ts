import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowService {

  private draggingStatus: boolean;

  private indicators = new BehaviorSubject<Array<any>>([]);
  private $indicators = this.indicators.asObservable();

  private firstCountry = new BehaviorSubject<any>(false);
  private $firstCountry = this.firstCountry.asObservable();

  private secondCountry = new BehaviorSubject<any>(false);
  private $secondCountry = this.secondCountry.asObservable();

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

  getIndicators() {
    return this.indicators;
  }

  setIndicators(indicators) {
    this.indicators.next(indicators);
  }

  getFirstCountry() {
    return this.firstCountry;
  }

  setFirstCountry(country) {
    this.firstCountry.next(country);
  }

  getSecondCountry() {
    return this.secondCountry;
  }

  setSecondCountry(country) {
    this.secondCountry.next(country);
  }

  comparisonGoingOn() {
    return this.firstCountry !== null && this.secondCountry !== null;
  }


}
