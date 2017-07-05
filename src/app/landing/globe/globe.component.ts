import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

const positronDark = new Cesium.UrlTemplateImageryProvider({
    url : 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
});
const positronLight = new Cesium.UrlTemplateImageryProvider({
    url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
});

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit {

  private points: any[];
  private currentPointAnimation: number;
  private runningAnimations: any[] = [];
  private viewer: any;
  private mode = 'dark';
  private interval: any;

  @Output()
  changeInfo: EventEmitter<any> = new EventEmitter<any>();

  constructor(private globeService: GlobeService) {

  }

  ngOnInit() {

    this.viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: positronDark,
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

    this.viewer.scene.imageryLayers.addImageryProvider(positronLight, 1);

    this.startMode('dark');

  }

  tick() {

    if (this.runningAnimations.length > 0 ) {
      const toRemove = [];
      let nextTick = false;
      for (const a of this.runningAnimations) {
        const ent = this.viewer.entities.getById(a.id);

        if (!ent) {
          console.log(`Not found ${a.id}`);
          continue;
        }

        const pixelSize = ent.point.pixelSize.getValue(),
          color = ent.point.color.getValue(),
          colorBorder = ent.point.outlineColor.getValue();

        if (pixelSize < FINISH_PIXEL_SIZE) {
          ent.point.pixelSize = pixelSize + 1;
          ent.point.color = this.getAnimationColor(color.alpha - ALPHA_DECREMENT);
          ent.point.outlineColor =  this.getAnimationColor(colorBorder.alpha - ALPHA_BORDER_DECREMENT);
          nextTick = true;
        } else {
          toRemove.push(a);
        }
      }
      for (const a of toRemove) {
        this.viewer.entities.removeById(a.id);
        const idx = this.runningAnimations.indexOf(a);
        if (idx !== -1) {
          this.runningAnimations.splice(idx, 1);
        }
      }

      if (nextTick) {
        Cesium.requestAnimationFrame(() => {
          this.tick();
        });
      }
    }
  }

  private switchMode() {
    if (this.runningAnimations.length > 0 ) {
      return setTimeout(() => {
        this.switchMode();
      }, 1000);
    }
    if (this.mode === 'dark') {
      this.startMode('light');
    } else {
      this.startMode('dark');
    }
  }

  private getPointColor(): any {
    return this.mode === 'dark' ? Cesium.Color.fromCssColorString('#EE2344')
      : Cesium.Color.fromCssColorString('#494DF4');
  }

  private getAnimationColor(alpha: number): any {
    return this.mode === 'dark' ? new Cesium.Color(1, 0, 0, alpha)
      : new Cesium.Color(0, 0, 1, alpha);
  }
  private startMode(mode: string) {
    this.mode = mode;
    if ( mode  === 'dark') {
      this.viewer.scene.imageryLayers.get(0).show = true ;
      this.viewer.scene.imageryLayers.get(1).show = false ;
    } else {
      this.viewer.scene.imageryLayers.get(1).show = true ;
      this.viewer.scene.imageryLayers.get(0).show = false ;
    }

    this.currentPointAnimation = 0;
    // Clear the map
    this.viewer.entities.removeAll();
    this.points = this.globeService.getData(this.mode);
    for (const l of this.points){
      this.viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(l.position[1], l.position[0]),
        point : {
          pixelSize : 10,
          color : this.getPointColor(),
          outlineColor : Cesium.Color.WHITE,
          outlineWidth : 2
        }
      });
    }

    setTimeout(() => {
      this.modeTick();
    }, 1000);

  }

  private modeTick() {
    if (this.currentPointAnimation >= this.points.length) {
      this.switchMode();
      return;
    }

    const l = this.points[this.currentPointAnimation],
      id = `pulse_${this.currentPointAnimation}`;

    // this.currentPointAnimation = (this.currentPointAnimation + 1) % this.points.length;
    this.currentPointAnimation += 1;

    const prev = this.viewer.entities.getById(id);
    if (prev) {
      this.viewer.entities.removeById(id);
    }

    this.viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(l.position[1], l.position[0], 10000000),
      complete: () => {

        this.changeInfo.emit(l);

        const ent = this.viewer.entities.add({
          id: id,
          position : Cesium.Cartesian3.fromDegrees(l.position[1], l.position[0]),
          point : {
            pixelSize : START_PIXEL_SIZE,
            color : this.getAnimationColor(START_ALPHA),
            outlineColor : this.getAnimationColor(START_ALPHA_BORDER),
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
      }
    });

    setTimeout( () => {
      this.modeTick();
    }, 7000);
  }

  modeClass() {
    const obj = {};
    obj[this.mode] = this.mode;
    obj['navControl'] = true;
    return obj;
  }
}
