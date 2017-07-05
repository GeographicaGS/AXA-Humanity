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

  geojson;

  firstCharacterDefaultPosition: any = {lat: 40.07807142745009, lng: -4.130859375};
  firstCharacterMarker;
  firstMarkerPreviousPosition;
  firstCharacterGeometry;
  firstGeometryStyle = {
    'color': '#FF1721',
    'weight': 1.5,
    'fillOpacity': 0.25,
    'opacity': 1
  };

  secondCharacterMarker;
  secondMarkerPreviousPosition;
  secondCharacterGeometry;
  secondGeometryStyle = {
    'color': '#00008F',
    'weight': 1.5,
    'fillOpacity': 0.25,
    'opacity': 1
  };

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

    if (this.indicator) {
      this.detailMode();
    } else {
      this.comparisonMode();
    }
  }

  private detailMode() {
    this.windowService.getIndicator().subscribe((indicator) => {
      if (!indicator) {
        // this.indicator = false;
      } else {
        // this.indicator = indicator;
        // @TODO: load viz for the kpi and add the layer to the map!
      }
    });
  }

  private comparisonMode() {

    this.defineCharacterMarkers();

    this.countryService.getGeojson().subscribe((geojson) => {
      this.geojson = geojson;
      this.countryGeojsonLayer = L.geoJson(geojson, {onEachFeature: this.onEachFeature});
      this.countryGeojsonLayer.addTo(this.map);
    });

    this.windowService.getSecondCountry().subscribe((country) => {
      if (country === false) {
        if (this.secondCharacterMarker) {
          this.map.removeLayer(this.secondCharacterMarker);
        }
        if (this.secondMarkerPreviousPosition) {
          this.secondMarkerPreviousPosition = null;
        }
        if (this.secondCharacterGeometry) {
          this.map.removeLayer(this.secondCharacterGeometry);
        }
      }
    });
  }

  onItemDrop($event) {
    const coordsX = $event.nativeEvent.clientX;
    const coordsY = $event.nativeEvent.clientY - 26;
    const point = L.point(coordsX, coordsY);
    const markerCoords = this.map.containerPointToLatLng(point);

    this.drawGeometryFromCoords(markerCoords, 'second');

    this.secondCharacterMarker.setLatLng(markerCoords).addTo(this.map);
  }

  drawGeometryFromCoords(markerCoords, who) {
    this.countryService.getCodeFromCoords(markerCoords.lat, markerCoords.lng).subscribe((data) => {
      const response = <any>data;

      if (!response.rows[0]) {
        // No country was found, let's move the marker to the previous position
        if (who === 'second') {
          this.secondCharacterMarker.setLatLng(this.secondMarkerPreviousPosition);
        } else {
          this.firstCharacterMarker.setLatLng(this.firstMarkerPreviousPosition);
        }
        return;
      }

      if (who === 'first') {
        if (this.firstCharacterGeometry) {
          this.map.removeLayer(this.firstCharacterGeometry);
        }
        this.firstCharacterGeometry = this.addFilteredGeoJson(response.rows[0].adm0_a3, this.firstGeometryStyle);

        this.windowService.setFirstCountry({name: response.rows[0].name, code: response.rows[0].adm0_a3});
      } else if (who === 'second') {

        if (this.secondCharacterGeometry) {
          this.map.removeLayer(this.secondCharacterGeometry);
        }
        this.secondCharacterGeometry = this.addFilteredGeoJson(response.rows[0].adm0_a3, this.secondGeometryStyle);

        this.windowService.setSecondCountry({name: response.rows[0].name, code: response.rows[0].adm0_a3});
      }
    });
  }

  private addFilteredGeoJson(adm0_a3, style) {
    return L.geoJson(this.geojson, {
      style: style,
      filter: (feature, layer) => {
        return feature.properties.adm0_a3 === adm0_a3;
      }
    }).addTo(this.map);
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
    this.firstCharacterMarker = L.marker(null, {icon: firstCharacterMarker, draggable: true})
      .on('dragstart', (e) => {
        this.firstMarkerPreviousPosition = e.target._latlng;
      })
      .on('dragend', (e) => {
        this.drawGeometryFromCoords(e.target._latlng, 'first');
      });

    this.getUserCountry().subscribe((data) => {
      // @TODO data.country, set marker there
      const response = <any>data;
      this.firstCharacterMarker.setLatLng(this.firstCharacterDefaultPosition).addTo(this.map);
      const coords = response.loc.split(',');
      this.drawGeometryFromCoords({lat: coords[0], lng: coords[1]}, 'first');
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
    this.secondCharacterMarker = L.marker(null, {icon: secondCharacterMarker, draggable: true})
      .on('dragstart', (e) => {
        this.secondMarkerPreviousPosition = e.target._latlng;
      })
      .on('dragend', (e) => {
        this.drawGeometryFromCoords(e.target._latlng, 'second');
      });
  }

  private getUserCountry(): Observable<any[]> {
    return this.http.get('https://ipinfo.io')
      .map(res => res.json() as any[]);
  }

  onEachFeature(feature, layer) {
    const offStyle = {
      'border-color': 'none',
      'weight': 1,
      'fillOpacity': 0,
      'opacity': 0
    };
    const onStyle = {
      'border-color': '#000',
      'weight': 1,
      'fillOpacity': 0,
      'opacity': 1
    };
    layer.setStyle(offStyle);
    layer.on('mouseover', (e) => {
      layer.setStyle(onStyle);
    }).on('mouseout', (e) => {
      layer.setStyle(offStyle);
    });
  }
}
