import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobeComponent } from './globe/globe.component';
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
    [LandingRoutingModule, ...components]
  ],
  providers: [],
})
export class LandingModule { }
