import { Component, OnInit, Input } from '@angular/core';
import { WindowService } from '../../common/window.service';

@Component({
  selector: 'app-axa-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  constructor(private windowService: WindowService) { }

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
