import { Component, OnInit } from '@angular/core';
import { GlobeService } from './globe.service';

declare var cdb: any;
declare var L: any;

const START_PIXEL_SIZE = 20;
const FINISH_PIXEL_SIZE = 180;
const START_ALPHA = 0.7;
const FINISH_ALPHA = 0.05;
const START_ALPHA_BORDER = 0.6;
const FINISH_ALPHA_BORDER = 0.05;
const ALPHA_DECREMENT = (START_ALPHA - FINISH_ALPHA) / (FINISH_PIXEL_SIZE - START_PIXEL_SIZE);
const ALPHA_BORDER_DECREMENT = (START_ALPHA_BORDER - FINISH_ALPHA_BORDER) / (FINISH_PIXEL_SIZE - START_PIXEL_SIZE);

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {

  private points: any[];
  private currentPointAnimation = 0;
  private runningAnimations: any[] = [];
  private viewer: any;

  constructor(private globeService: GlobeService) {

  }

  ngOnInit() {

    const positron = new Cesium.UrlTemplateImageryProvider({
        url : 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    });

    this.viewer = new Cesium.Viewer('cesiumContainer', {
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

    this.points = this.globeService.getData();
    for (const l of this.points){
      this.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(l.position[1], l.position[0]),
        point : {
          pixelSize : 10,
          color : Cesium.Color.fromCssColorString('#EE2344'),
          outlineColor : Cesium.Color.WHITE,
          outlineWidth : 2
        }
      });
    }

    this.animationLauncher();

  }

  tick() {

    if (this.runningAnimations.length > 0 ) {
      const a = this.runningAnimations[0];
      const ent = this.viewer.entities.getById(a.id),
        pixelSize = ent.point.pixelSize.getValue(),
        color = ent.point.color.getValue(),
        colorBorder = ent.point.outlineColor.getValue();

      if (pixelSize < FINISH_PIXEL_SIZE) {
        ent.point.pixelSize = pixelSize + 1;
        ent.point.color =  new Cesium.Color(1, 0, 0, color.alpha - ALPHA_DECREMENT);
        ent.point.outlineColor =  new Cesium.Color(1, 0, 0, colorBorder.alpha - ALPHA_BORDER_DECREMENT);
        Cesium.requestAnimationFrame(() => {
          this.tick();
        });
      } else {
        this.runningAnimations = [];
        this.viewer.entities.removeById(a.id);
      }
    }
  }

  animationLauncher() {

    setInterval(() => {
      const l = this.points[this.currentPointAnimation],
        id = `pulse_${this.currentPointAnimation}`;

      this.currentPointAnimation = (this.currentPointAnimation + 1) % this.points.length;

      const prev = this.viewer.entities.getById(id);
      if (prev) {
        this.viewer.entities.removeById(id);
      }

      this.viewer.entities.add({
        id: id,
        position : Cesium.Cartesian3.fromDegrees(l.position[1], l.position[0]),
        point : {
          pixelSize : START_PIXEL_SIZE,
          color : new Cesium.Color(1, 0, 0, START_ALPHA),
          outlineColor : new Cesium.Color(1, 0, 0, START_ALPHA_BORDER),
          outlineWidth : 1
        }
      });

      this.runningAnimations.push({
        id: id,
        pixelSize: 12
      });

      Cesium.requestAnimationFrame(() => {
        this.tick();
      });

    }, 4000);
  }

}
