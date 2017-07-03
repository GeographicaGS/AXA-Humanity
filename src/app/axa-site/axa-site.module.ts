import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AxaSiteComponent } from './axa-site.component';
import { AxaSiteRoutingModule } from './axa-site-routing.module';

const components = [
  AxaSiteComponent
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
