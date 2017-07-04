import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { WindowService } from '../window.service';
import { IndicatorService } from './indicator.service';

import * as stickybits from 'stickybits';

@Component({
  selector: 'app-axa-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  @HostBinding('class.dragging') dragging;

  indicators: any[];

  constructor(private windowService: WindowService, private indicatorService: IndicatorService) {
    this.indicatorService.getIndicators().subscribe((data) => {
      this.indicators = data;

      setTimeout(() => {
        stickybits('.title', {useStickyClasses: true});
      }, 400);

    });
  }

  ngOnInit() {
    if (this.indicator) {
    }
  }

  hasIndicator() {
    return this.indicator !== undefined;
  }

  onDragStart($event) {
    this.dragging = true;
    this.windowService.setDraggingStatus(true);
  }

  onDragEnd($event) {
    this.dragging = false;
    this.windowService.setDraggingStatus(false);
  }

  getIndicatorIcon(indicator) {
    if (!indicator.icon) {
      return { };
    } else {
      return {'background-image': `url(/assets/icons/${indicator.icon})`};
    }
  }

  toggleIndicator($event) {
    const target = $event.currentTarget;
    target.parentElement.classList.toggle('active');
  }

  getFirstCountryName() {
    const country = this.windowService.getFirstCountry();
    return country !== null ? country.name : false;
  }

  getSecondCountryName() {
    const country = this.windowService.getSecondCountry();
    return country !== null ? country.name : false;
  }

  isComparisonGoingOn() {
    return this.windowService.comparisonGoingOn();
  }
}
