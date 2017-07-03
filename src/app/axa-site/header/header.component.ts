import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-axa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  public headerTitle = 'board';

  constructor() {
  }

  ngOnInit() {
    if (this.indicator) {
      this.headerTitle = 'healthcare'; // @TODO: get title from indiators.json filtering by id (this.indicator)
    }
  }

  hasIndicator() {
    return this.indicator !== undefined;
  }

}
