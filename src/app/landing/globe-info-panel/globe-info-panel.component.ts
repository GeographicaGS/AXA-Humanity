import { Component, OnInit,  OnChanges, Input, Host} from '@angular/core';

@Component({
  selector: 'app-globe-info-panel',
  templateUrl: './globe-info-panel.component.html',
  styleUrls: ['./globe-info-panel.component.scss']
})
export class GlobeInfoPanelComponent implements OnInit, OnChanges {

  @Input()
  infoModel: any;
  animation = false;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (!this.infoModel) {
      return;
    }
    console.log('Changes');
    this.animation = true;
    setTimeout(() => {
      this.animation = false;
    }, 6000);
  }

  classes() {
    const obj = {};
    obj[this.animation ? 'show' : 'hide'] = true;
    obj[this.infoModel.type] = true;
    return obj;
  }

}
