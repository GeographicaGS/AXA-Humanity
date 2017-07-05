import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '../window.service';
import { IndicatorService } from '../indicator/indicator.service';

@Component({
  selector: 'app-axa-indicator-navigation',
  templateUrl: './indicator-navigation.component.html',
  styleUrls: ['./indicator-navigation.component.scss']
})
export class IndicatorNavigationComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  currentIndicator;

  kpisIdList: any = [];

  constructor(private router: Router, private windowService: WindowService, private indicatorService: IndicatorService) {
    this.windowService.getIndicator().subscribe((indicator) => {
      if (indicator) {
        this.currentIndicator = indicator.kpi.id;
      }
    });

    this.indicatorService.getIndicators().subscribe((data) => {
      this.processKpisForNavigation(data);
    });
  }

  ngOnInit() {
  }

  processKpisForNavigation(indicators) {
    for (const category of indicators) {
      for (const kpi of category.kpis) {
        this.kpisIdList.push({id: kpi.id, current: this.indicator === kpi.id});
      }
    }
  }

  back() {
    let back = this.currentIndicator - 1;
    if (back === 0) {
      back = this.kpisIdList[this.kpisIdList.length - 1].id;
    }
    this.router.navigate(['/map/' + back]);
  }

  next() {
    let next = this.currentIndicator + 1;
    if (this.currentIndicator === this.kpisIdList.length) {
      next = this.kpisIdList[0].id;
    }
    this.router.navigate(['/map/' + next]);
  }
}
