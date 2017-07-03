import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-axa-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  constructor() { }

  ngOnInit() {
    if (this.indicator) {
    }
  }

  hasIndicator() {
    return this.indicator !== undefined;
  }

}
