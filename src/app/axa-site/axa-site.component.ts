import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WindowService } from './window.service';
import { IndicatorService } from './indicator/indicator.service';

@Component({
  selector: 'app-axa-site',
  templateUrl: './axa-site.component.html',
  styleUrls: ['./axa-site.component.scss']
})
export class AxaSiteComponent implements OnInit {

  indicator: any = undefined;

  constructor(private route: ActivatedRoute, private indicatorService: IndicatorService, private windowService: WindowService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== null && params['id'] !== undefined) {
        this.indicator = parseInt(params['id'], 10);
        this.getIndicatorById(this.indicator);
      } else {
        this.windowService.setIndicator(false);
      }
   });
  }

  private getIndicatorById(id) {
    this.indicatorService.getIndicators().subscribe((data) => {
      for (const cat of data) {
        const result = cat.kpis.filter((kpi) => kpi.id === id);
        if (result.length) {
          this.indicator = {category: {title: cat.title, icon: cat.icon}, kpi: result};
          this.windowService.setIndicator(this.indicator);
          break;
        }
      }
    });
  }
}
