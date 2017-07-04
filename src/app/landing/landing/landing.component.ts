import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public infoModel: any = null;
  constructor() {

  }

  ngOnInit() { }

  changeInfoModel(infoModel: any) {
    this.infoModel = infoModel;
  }

}
