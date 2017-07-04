import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { AxaSiteComponent } from './axa-site.component';
import { AxaSiteRoutingModule } from './axa-site-routing.module';

import { MapComponent } from './map/map.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { IndicatorService } from './indicator/indicator.service';
import { CountryGeojsonService } from './map/country-geojson.service';

import { Ng2DragDropModule } from 'ng2-drag-drop';
import { WindowService } from './window.service';


const components = [
  AxaSiteComponent,
  MapComponent,
  IndicatorComponent,
  HeaderComponent,
  FooterComponent
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AxaSiteRoutingModule,
    Ng2DragDropModule
  ],
  declarations: components,
  exports: [
    [AxaSiteRoutingModule, ...components]
  ],
  providers: [WindowService, IndicatorService, CountryGeojsonService],
  bootstrap: [AxaSiteComponent]
})
export class AxaSiteModule { }
