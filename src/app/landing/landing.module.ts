import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from './globe/globe.component';
import { GlobeInfoPanelComponent } from './globe-info-panel/globe-info-panel.component';
import { LandingComponent } from './landing/landing.component';
import { DataPanelComponent } from './data-panel/data-panel.component';
import { GlobeService } from './globe/globe.service';
import { LandingRoutingModule } from './landing.routing.module';

const components = [
  GlobeComponent,
  LandingComponent,
  DataPanelComponent,
  GlobeInfoPanelComponent
];

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule
  ],
  declarations: components,
  exports: [
    [ LandingRoutingModule, ...components ]
  ],
  providers: [ GlobeService ],
})
export class LandingModule { }
