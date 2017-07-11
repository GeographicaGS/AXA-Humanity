import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Http } from '@angular/http';
import { WindowService } from '../window.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { CountryGeojsonService } from './country-geojson.service';
import { UtilsService } from '../../common/utils.service';

declare var cdb: any;
declare var L: any;

@Component({
  selector: 'app-axa-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input('indicator') indicator;

  @HostBinding('class.loading') isLoading = true;

  geojson;

  currentLayer;
  layerSource;

  axaLayer: any = false;
  axaLayerSource;

  labelsLayer;

  firstCharacterDefaultPosition: any = {lat: 48.864716, lng: 2.349014}; // France
  firstCharacterMarker;
  firstMarkerPreviousPosition;
  firstCharacterGeometry;
  firstGeometryStyle = {
    'color': '#f02849',
    'weight': 1.5,
    'fillOpacity': 0.25,
    'opacity': 1
  };

  secondCharacterMarker;
  secondMarkerPreviousPosition;
  secondCharacterGeometry;
  secondGeometryStyle = {
    'color': '#494df4',
    'weight': 1.5,
    'fillOpacity': 0.25,
    'opacity': 1
  };

  countryGeojsonLayer;
  infoPopup;
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

  constructor(
    private utils: UtilsService,
    private http: Http,
    private windowService: WindowService,
    private countryService: CountryGeojsonService) {

      this.windowService.getLoadingStatus().subscribe((loading) => {
        if (!loading) {
          setTimeout(() => {
            this.isLoading = false;
            this.map.invalidateSize();
          }, 120);
        }
      });
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
        { style: 'light_nolabels', zIndex: 0 } )
      ]
    }).on('zoomend', () => {
      if (this.map.getZoom() < 4 && this.labelsLayer) {
        this.labelsLayer.setZIndex(98);
      } else if (this.labelsLayer) {
        this.labelsLayer.setZIndex(101);
      }
    });
    if (this.indicator) {
      this.detailMode();
    } else {
      this.comparisonMode();
    }
  }

  private detailMode() {

    this.windowService.getIndicator().subscribe((indicator) => {
      this.map.setZoom(3);
      if (indicator) {
        this.indicator = indicator;
        this.layerSource = {
          user_name: 'axa-cdo',
          type: 'cartodb',
          sublayers: indicator.kpi.layers
        };

        if (this.currentLayer) {
          this.map.removeLayer(this.currentLayer);
        }

        cdb.createLayer(this.map, this.layerSource, {legends: true, https: true})
          .addTo(this.map)
          .on('done', (layer) => {
            this.currentLayer = layer;
            this.currentLayer.setZIndex(99);
            layer.setInteraction(true);

            const sublayer1 = layer.getSubLayer(0);
            sublayer1.setInteraction(true);
            sublayer1.on('mouseover', (e, latlng, point, data) => {
              this.overPopup(latlng, data);
            }).on('mouseout', () => {
              this.outPopup();
            });

            const sublayer2 = layer.getSubLayer(1);
            sublayer2.setInteraction(true);
            sublayer2.on('mouseover', (e, latlng, point, data) => {
              this.overPopup(latlng, data);
            }).on('mouseout', () => {
              this.outPopup();
            });

            let axaZIndex = 101;
            if (this.map.getZoom() < 4) {
              axaZIndex = 98;
            }
            this.labelsLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
              style: 'light_only_labels',
              zIndex: axaZIndex
            }).addTo(this.map);
          })
          .on('error', (error) => { console.log('error', error); });
      }
    });
  }

  private overPopup(latlng, data) {
    if (this.infoPopup) {
      this.infoPopup.setLatLng(latlng).setContent(this.setPopupTemplate(data));
    } else {
      this.infoPopup = L.popup({className: 'axa-popup', closeButton: false})
       .setLatLng(latlng)
       .setContent(this.setPopupTemplate(data))
       .openOn(this.map);
    }
  }

  private outPopup() {
    if (this.infoPopup) {
      this.map.removeLayer(this.infoPopup);
      this.infoPopup = false;
    }
  }

  private setPopupTemplate(data) {
    let template = `<div class='countryName'>${data.name}</div>`,
        dataFormatted,
        averageFormatted;

    if (data.data !== null) {
      dataFormatted = this.utils.formatNumber(data.data);
      template = template + `<div class='value'>${dataFormatted} ${this.indicator.kpi.unit}</div>`;
    } else {
      template = template + `<div class='value noData'>No data found</div>`;
    }

    if (data.average && data.data !== null) {
      let avgDiff,
          avgClass = 'positive';
      averageFormatted = this.utils.formatNumber(data.average);
      if (data.data > data.average) {
        avgDiff = this.utils.formatNumber(data.data - data.average);
        avgDiff = '+ ' + avgDiff;
      } else {
        avgDiff = this.utils.formatNumber(data.average - data.data);
        avgDiff = '- ' + avgDiff;
        avgClass = 'negative';
      }

      template = template + `<div class='avg'><span class='${avgClass}'>${avgDiff}</span></div>`;
    }
    return template;
  }

  defineAxaLayer() {

    this.axaLayerSource = {
      user_name: 'axa-cdo',
      type: 'cartodb',
      sublayers: [
        {
          'sql': 'SELECT * FROM world_borders_hd_copy;',
          'cartocss': `#layer [axa=true]{
              line-width: 0.4;
              polygon-pattern-file: url('https://image.ibb.co/cLkDhv/trama_mapa_axa.png');
              polygon-pattern-opacity: 1;
              polygon-pattern-alignment: global;
              line-color: #494df4 ;
              line-opacity: 0.7;

             [zoom>=4]{
                line-width:0;
              }
          }`
        }
      ]
    };

    if (this.axaLayer) {
      this.map.removeLayer(this.axaLayer);
    }

    cdb.createLayer(this.map, this.axaLayerSource, {legends: true, https: true})
      .on('done', (layer) => {
        this.axaLayer = layer;
        this.axaLayer.setZIndex(100);
      })
      .on('error', (error) => { console.log('error', error); })
      .addTo(this.map);
  }

  private comparisonMode() {

    this.labelsLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
      style: 'light_only_labels',
      zIndex: 101
    }).addTo(this.map);

    this.countryService.getGeojson().subscribe((geojson) => {
      this.geojson = geojson;
      this.countryGeojsonLayer = L.geoJson(geojson, {onEachFeature: this.onEachFeature})
        .on('click', (e) => {
          this.setProperMarkerAndGeomPosition({x: e.originalEvent.clientX, y: e.originalEvent.clientY});
        });
      this.countryGeojsonLayer.addTo(this.map);
      this.defineCharacterMarkers();
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
    this.setProperMarkerAndGeomPosition({x: $event.nativeEvent.clientX, y: $event.nativeEvent.clientY});
  }

  setProperMarkerAndGeomPosition(coords) {
    const coordsX = coords.x;
    const coordsY = coords.y;
    const coordsYMarker = coords.y - 40;
    const point = L.point(coordsX, coordsY);
    const pointMarker = L.point(coordsX, coordsYMarker);
    const markerCoords = this.map.containerPointToLatLng(point);

    this.drawGeometryFromCoords(markerCoords, 'second');
    this.secondCharacterMarker.setLatLng(this.map.containerPointToLatLng(pointMarker)).addTo(this.map);
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
        iconUrl: '/assets/icons/character1-alt_map.svg',
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

    this.drawGeometryFromCoords(this.firstCharacterDefaultPosition, 'first');
    this.firstCharacterMarker.setLatLng(this.firstCharacterDefaultPosition).addTo(this.map);

    // this.getUserCountry().subscribe((data) => {
    //   // @TODO data.country, set marker there
    //   const response = <any>data;
    //   this.firstCharacterMarker.setLatLng(this.firstCharacterDefaultPosition).addTo(this.map);
    //   const coords = response.loc.split(',');
    //   this.drawGeometryFromCoords({lat: coords[0], lng: coords[1]}, 'first');
    // });
  }

  private defineSecondCharacterMarker() {
    const SecondCharacterMarker = L.Icon.Default.extend({
      options: {
        iconUrl: '/assets/icons/character2-alt_map.svg',
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

  indicatorDetailView() {
    return this.indicator !== false && this.indicator !== undefined;
  }

  zoomIn() {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom + 1);
  }

  zoomOut() {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom - 1);
  }

  toggleAxaLayer() {
    if (!this.axaLayer) {
      this.defineAxaLayer();
    } else {
      this.map.removeLayer(this.axaLayer);
      this.axaLayer = false;
    }
  }

  hasAxaLayerEnabled() {
    return this.axaLayer !== false;
  }
}
