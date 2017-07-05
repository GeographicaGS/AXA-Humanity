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

  firstCountry;
  secondCountry;

  constructor(private windowService: WindowService, private indicatorService: IndicatorService) {

    this.windowService.getFirstCountry().subscribe((country) => {
      this.firstCountry = country;
      this.processKpis(this.firstCountry, 'first');
    });
    this.windowService.getSecondCountry().subscribe((country) => {
      this.secondCountry = country;
      this.processKpis(this.secondCountry, 'second');
    });

    this.indicatorService.getIndicators().subscribe((data) => {
      this.indicators = data;

      if (this.firstCountry) {
        this.processKpis(this.firstCountry, 'first');
      }
      if (this.secondCountry) {
        this.processKpis(this.secondCountry, 'second');
      }
      setTimeout(() => {
        stickybits('.title', {useStickyClasses: true});
      }, 400);
    });

  }

  processKpis(country = null, type = 'first') {
    if (!this.indicators) { return; }
    for (const category in this.indicators) {
      if (this.indicators[category].kpis) {
        for (const kpi in this.indicators[category].kpis) {
          if (this.indicators[category].kpis[kpi]) {
            this.indicatorService.getKpiData(this.indicators[category].kpis[kpi].tableName, country.code).subscribe((kpiData) => {
              const response = <any>kpiData;
              if (type === 'first') {
                this.indicators[category].kpis[kpi].firstCountryValue = response.rows[0] ? response.rows[0].data : null;
              } else {
                this.indicators[category].kpis[kpi].secondCountryValue = response.rows[0] ? response.rows[0].data : null;
              }
            });
          }
        }
      }
    }
  }

  ngOnInit() {
    if (this.indicator) { }
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
    return this.firstCountry ? this.firstCountry.name : false;
  }

  getSecondCountryName() {
    return this.secondCountry ? this.secondCountry.name : false;
  }

  isComparisonGoingOn() {
    return this.firstCountry && this.secondCountry;
  }

  getFillBar(value, value2, units = '%') {
    if (value === null) {
      value = 0;
    }
    if (units !== '%') {
      if (value < value2) {
        value = (value * 100) / value2;
      } else {
        value = 100;
      }

    } else if (value > 100) {
      value = 100;
    }

    return { 'width': value + '%'};
  }
}
