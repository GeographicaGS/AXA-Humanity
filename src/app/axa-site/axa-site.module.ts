import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AxaSiteComponent } from './axa-site.component';
import { AxaSiteRoutingModule } from './axa-site-routing.module';

import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

const components = [
  AxaSiteComponent,
  MapComponent,
  HeaderComponent,
  FooterComponent
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AxaSiteRoutingModule
  ],
  declarations: components,
  exports: [
    [AxaSiteRoutingModule, ...components]
  ],
  providers: [],
  bootstrap: [AxaSiteComponent]
})
export class AxaSiteModule { }
