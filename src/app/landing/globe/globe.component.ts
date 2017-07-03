import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {


  constructor() { }

  ngOnInit() {

    var positron = new Cesium.UrlTemplateImageryProvider({
        url : 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    });

    var viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: positron,
        baseLayerPicker: false,
        fullscreenButton: false,
        homeButton: false,
        timeline: false,
        navigationHelpButton: false,
        animation: false,
        scene3DOnly: true,
        geocoder: false,
        infoBox: false,
        vrButton: false,
        creditContainer: 'cesiumCredit'
    });

    // var dataSource = new Cesium.GeoJsonDataSource();
    // viewer.dataSources.add(dataSource);
    // var sql = new cartodb.SQL({user: 'cartotraining', format: 'geoJSON'});
    // sql.execute("SELECT * FROM ne_10m_populated_places_simple WHERE adm0_a3 like 'USA' AND pop_max > 1000000")
    //         .done(function (data) {
    //             dataSource.load(data)
    //                     .then(function () {
    //                     })
    //         })
    //         .error(function (errors) {
    //             // errors contains a list of errors
    //             console.log("errors:" + errors);
    //         });
  }

}
