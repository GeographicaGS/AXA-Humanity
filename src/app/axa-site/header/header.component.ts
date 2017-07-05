import { Component, OnInit, Input } from '@angular/core';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-axa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  private headerTitle = 'board';

  constructor(private windowService: WindowService) {
    this.windowService.getIndicator().subscribe((indicator) => {
      if (!indicator) {
        this.headerTitle = 'board';
      } else {
        this.headerTitle = indicator.category.title;
      }
    });
  }

  ngOnInit() {
  }

  hasIndicator() {
    return this.indicator !== undefined;
  }

}
