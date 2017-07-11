import { Component, OnInit, HostBinding } from '@angular/core';
import { WindowService } from '../../axa-site/window.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  @HostBinding('class.loading') isLoading = true;
  @HostBinding('class.loaded') isNotLoading = false;

  public infoModel: any = null;

  constructor(private windowService: WindowService) {
    this.windowService.getLoadingStatus().subscribe((loading) => {
      this.isLoading = loading;
      this.isNotLoading = !this.isLoading;
    });
  }

  ngOnInit() {
  }

  changeInfoModel(infoModel: any) {
    this.infoModel = infoModel;
  }
}
