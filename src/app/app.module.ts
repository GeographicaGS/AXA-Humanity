import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CommonModule } from './common/common.module';

import { AppComponent } from './app.component';

import { AxaSiteModule } from './axa-site/axa-site.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    AxaSiteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
