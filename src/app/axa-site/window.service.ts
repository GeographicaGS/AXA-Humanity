import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

function getWindow (): any {
  return window;
}

@Injectable()
export class WindowService {

  private draggingStatus: boolean;

  private indicator = new BehaviorSubject<any>(false);
  private $indicator = this.indicator.asObservable();

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

  getIndicator() {
    return this.indicator;
  }

  setIndicator(indicator) {
    this.indicator.next(indicator);
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
