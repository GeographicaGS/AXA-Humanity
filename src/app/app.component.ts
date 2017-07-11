import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsEventsService } from './common/google-analytics-events.service';
import { WindowService } from './axa-site/window.service';
declare var ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isLoading = true;

  constructor(private windowService: WindowService,
              public router: Router,
              public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

    this.windowService.getLoadingStatus().subscribe((loading) => {
      this.isLoading = loading;
    });

    setTimeout(() => {
      this.windowService.setLoadingStatusAsFalse();
    }, 500);
  }
}
