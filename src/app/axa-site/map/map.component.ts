import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { WindowService } from '../window.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { CountryGeojsonService } from './country-geojson.service';

declare var cdb: any;
declare var L: any;

@Component({
  selector: 'app-axa-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input('indicator') indicator;

  firstCharacterDefaultPosition: any = {lat: 40.07807142745009, lng: -4.130859375};
  firstCharacterMarker;
  secondCharacterMarker;
  countryGeojsonLayer;

  map: any = {};
  options: any = {
    zoomControl: false,
    center: L.latLng(this.firstCharacterDefaultPosition.lat, this.firstCharacterDefaultPosition.lng),
    zoom: 5,
    minZoom: 1,
    maxZoom: 19,
    layers: [],
    vizUrl: '',
    markerRadius: 7
  };

  constructor(private http: Http, private windowService: WindowService, private countryService: CountryGeojsonService) {
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

    this.defineCharacterMarkers();

    this.countryService.getGeojson().subscribe((geojson) => {
      this.countryGeojsonLayer = L.geoJson(geojson, {onEachFeature: this.onEachFeature});
      // this.countryGeojsonLayer.on('mouseover', (e) => {
      //   // debugger;
      //   // console.log('geojson over');
      // });
      this.countryGeojsonLayer.addTo(this.map);
    });
  }

  onEachFeature(feature, layer) {
    const offStyle = {
      "border-color": "none",
      "weight": 1,
      "fillOpacity": 0,
      "opacity": 0
    };
    const onStyle = {
      "border-color": "#000",
      "weight": 1,
      "fillOpacity": 0,
      "opacity": 1
    };
    layer.setStyle(offStyle);
    layer.on('mouseover', (e) => {
      layer.setStyle(onStyle);
    }).on('mouseout', (e) => {
      layer.setStyle(offStyle);
    });
  }

  markerBeingDragged() {
    return this.windowService.getDraggingStatus() === true;
  }

  onItemDrop($event) {
    const coordsX = $event.nativeEvent.clientX;
    const coordsY = $event.nativeEvent.clientY - 26;
    const point = L.point(coordsX, coordsY);
    const markerCoords = this.map.containerPointToLatLng(point);
    this.secondCharacterMarker.setLatLng(markerCoords).addTo(this.map);
    this.secondCharacterMarker.on('drag', (e) => {
      if (e.forced) {

      }
    }).on('dragend', (e) => {
    });

    this.secondCharacterMarker.fireEvent('drag', {forced: true});
    this.map.fireEvent('mouseover', {
      latlng: markerCoords,
      layerPoint: this.map.latLngToLayerPoint(markerCoords),
      containerPoint: this.map.latLngToContainerPoint(markerCoords)
    });
  }

  private defineCharacterMarkers() {
    this.defineFirstCharacterMarker();
    this.defineSecondCharacterMarker();
  }

  private defineFirstCharacterMarker() {
    const FirstCharacterMarker = L.Icon.Default.extend({
      options: {
        iconUrl: '/assets/icons/character1_map.svg',
        iconSize: [28, 52],
        shadowSize: [0, 0],
        iconAnchor: [8, 8]
      }
    });
    const firstCharacterMarker = new FirstCharacterMarker();
    this.firstCharacterMarker = L.marker(null, {icon: firstCharacterMarker, draggable: true});

    this.getUserCountry().subscribe((data) => {
      // @TODO data.country, set marker there
      this.firstCharacterMarker.setLatLng(this.firstCharacterDefaultPosition).addTo(this.map);
    });
  }

  private defineSecondCharacterMarker() {
    const SecondCharacterMarker = L.Icon.Default.extend({
      options: {
        iconUrl: '/assets/icons/character2_map.svg',
        iconSize: [28, 52],
        shadowSize: [0, 0],
        iconAnchor: [8, 8]
      }
    });
    const secondCharacterMarker = new SecondCharacterMarker();
    this.secondCharacterMarker = L.marker(null, {icon: secondCharacterMarker, draggable: true});
  }

  private getUserCountry(): Observable<any[]> {
    return this.http.get('https://ipinfo.io')
      .map(res => res.json() as any[]);
  }
}
