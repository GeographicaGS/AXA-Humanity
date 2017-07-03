import { Component, OnInit } from '@angular/core';

declare var cdb: any;
declare var L: any;

@Component({
  selector: 'app-axa-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: any = {};
  options: any = {
    zoomControl: false,
    center: L.latLng(19.476950206488414, -1.58203125),
    zoom: 2,
    minZoom: 1,
    maxZoom: 19,
    layers: [],
    vizUrl: '',
    markerRadius: 7
  };

  constructor() {
  }

  ngOnInit() {
    this.map = L.map('map', {
      zoomControl: this.options.zoomControl,
      center: this.options.center,
      zoom: this.options.zoom,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      layers: [
         L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png',
         { style: 'light_all', zIndex: 0 } )
      ]
    });
  }

}
