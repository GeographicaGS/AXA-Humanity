import { Component, OnInit, Input } from '@angular/core';
import { WindowService } from '../window.service';
import { IndicatorService } from './indicator.service';

@Component({
  selector: 'app-axa-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  indicators: any[];

  constructor(private windowService: WindowService, private indicatorService: IndicatorService) {
    this.indicatorService.getIndicators().subscribe((data) => {
      this.indicators = data;
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
    this.windowService.setDraggingStatus(true);
  }

  onDragEnd($event) {
    this.windowService.setDraggingStatus(false);
  }

}
