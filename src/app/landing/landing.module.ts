import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from './globe/globe.component';
import { GlobeService } from './globe/globe.service';
import { LandingRoutingModule } from './landing.routing.module';

const components = [
  GlobeComponent
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
