import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-axa-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('indicator') indicator = undefined;

  @HostBinding('class.loading') isLoading = true;

  public headerTitle = 'board';

  constructor(private windowService: WindowService) {
    this.windowService.getIndicator().subscribe((indicator) => {
      if (!indicator) {
        this.headerTitle = 'board';
      } else {
        this.headerTitle = indicator.category.title;
      }
    });

    this.windowService.getLoadingStatus().subscribe((loading) => {
      if (!loading) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
  }

  hasIndicator() {
    return this.indicator !== undefined;
  }

}
