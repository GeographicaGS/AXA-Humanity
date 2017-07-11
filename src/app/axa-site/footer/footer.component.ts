import { Component, OnInit, HostBinding } from '@angular/core';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-axa-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @HostBinding('class.loading') isLoading = true;

  constructor(private windowService: WindowService) {
    this.windowService.getLoadingStatus().subscribe((loading) => {
      if (!loading) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
  }

}
