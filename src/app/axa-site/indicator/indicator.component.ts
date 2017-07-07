import { Component, OnInit, Input, HostBinding, AfterViewInit } from '@angular/core';
import { WindowService } from '../window.service';
import { IndicatorService } from './indicator.service';

import * as stickybits from 'stickybits';
import * as perfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'app-axa-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit, AfterViewInit {

  @Input('indicator') indicator = undefined;

  @HostBinding('class.dragging') dragging;

  @HostBinding('class.freeFromTop') freeFromTop;

  indicators: any[];

  firstCountry;
  secondCountry;

  constructor(private windowService: WindowService, private indicatorService: IndicatorService) { }

  ngOnInit() {

    if (this.indicator) {
      this.windowService.getIndicator().subscribe((indicator) => {
        if (!indicator) {
          return;
        } else {
          this.indicator = indicator;
          this.detailMode();
        }
      });
    } else {
      this.comparisonMode();
    }
  }

  ngAfterViewInit() {
    perfectScrollbar.initialize(<any>document.getElementsByClassName('content')[0], {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
  }

  private detailMode() {
    this.firstCountry = false;
    this.secondCountry = false;
    this.windowService.setFirstCountry(this.firstCountry);
    this.windowService.setSecondCountry(this.secondCountry);
    this.indicators = [];
    this.processSingleKpi();
  }

  private processSingleKpi() {
    this.indicatorService.getKpiStatistics(this.indicator.kpi.tableName).subscribe((data) => {
      const response = <any>data;
      if (response.rows[0]) {
        this.indicator.stats = response.rows[0];
      }
    });
  }

  private comparisonMode() {
    this.windowService.getFirstCountry().subscribe((country) => {
      this.firstCountry = country;
      if (this.firstCountry) {
        this.processKpis(this.firstCountry, 'first');
      }
    });
    this.windowService.getSecondCountry().subscribe((country) => {
      this.secondCountry = country;
      if (this.secondCountry) {
        this.processKpis(this.secondCountry, 'second');
      }
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

  onDragStart($event) {
    this.dragging = true;
    this.windowService.setDraggingStatus(true);
  }

  onDragEnd($event) {
    this.dragging = false;
    this.windowService.setDraggingStatus(false);
  }

  getIndicatorIcon(indicator) {
    if (!indicator || !indicator.icon) {
      return { };
    } else {
      return {'background-image': `url(/assets/icons/${indicator.icon})`};
    }
  }

  toggleIndicator($event, detail = false) {
    const target = $event.currentTarget;
    const parent = target.parentElement;

    parent.classList.toggle('active');
    if (detail) {
      parent.classList.toggle('showingTitle');
      this.freeFromTop = !this.freeFromTop;
    }

    // This is a workaround to update the scroll location since the perfect-scrollbar plugin doesn't.
    const content = document.getElementsByClassName('content')[0];
    const activeLi = document.getElementsByClassName('indicatorsList')[0].getElementsByClassName('active');
    if (activeLi.length === 0) {
      content.scrollTop = 0;

      perfectScrollbar.update(<any>document.getElementsByClassName('content')[0]);
    } else if (parent.classList.toString().indexOf('active') === -1) {
      content.scrollTop = parent.offsetTop;
    }
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

  hasComparisonModeEnabled() {
    return this.indicators !== undefined && this.indicators.length > 0 && (this.indicator === false || this.indicator === undefined);
  }

  toggleKpiInfo(kpiId) {
    const infoElement = document.getElementById('kpiInfo_' + kpiId);
    if (infoElement) {
      infoElement.classList.toggle('active');
    }
  }

  highlightTitle($event, kpiId) {
    const titleElement = document.getElementById('kpi_' + kpiId + '_title');
    if (titleElement) {
      titleElement.classList.add('hover');
    }

    const tooltipContainer = $event.currentTarget;
    if (tooltipContainer.classList.toString().indexOf('tooltipContainer') !== -1 && tooltipContainer.getAttribute('data-tooltipmsg')) {
      // Handle tooltip position, place it in the top (centered) of the tooltipContainer
      const target = <any>document.getElementsByClassName('globalViewMsg')[0];
      target.innerHTML = tooltipContainer.getAttribute('data-tooltipmsg');
      const containerBoundingRect = tooltipContainer.getBoundingClientRect();

      target.style.top = (containerBoundingRect.top - containerBoundingRect.height - 4) + 'px';
      target.style.left = (containerBoundingRect.left - (target.getBoundingClientRect().width / 2) + (containerBoundingRect.width / 2)) + 'px';
      target.classList.add('active');
    }
  }

  normalTitle($event, kpiId) {
    const titleElement = document.getElementById('kpi_' + kpiId + '_title');
    if (titleElement) {
      titleElement.classList.remove('hover');
    }

    const tooltipContainer = $event.currentTarget;
    if (tooltipContainer.classList.toString().indexOf('tooltipContainer') !== -1 && tooltipContainer.getAttribute('data-tooltipmsg')) {
      const target = <any>document.getElementsByClassName('globalViewMsg')[0];
      if (target) {
        target.classList.remove('active');
      }
    }
  }

  highlightTooltip($event, kpiId) {
    const tooltipContainer = document.getElementById('kpi_' + kpiId + '_tooltip');
    if (tooltipContainer) {
      tooltipContainer.classList.add('hover');
    }
  }

  normalTooltip($event, kpiId) {
    const tooltipContainer = document.getElementById('kpi_' + kpiId + '_tooltip');
    if (tooltipContainer) {
      tooltipContainer.classList.remove('hover');
    }
  }

  clearSecondCountry() {
    this.secondCountry = false;
    this.windowService.setSecondCountry(this.secondCountry);
  }
}
