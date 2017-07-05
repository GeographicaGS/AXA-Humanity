import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LOCALE_ID } from '@angular/core';

import { CommonModule } from './common/common.module';

import { AppComponent } from './app.component';

import { AxaSiteModule } from './axa-site/axa-site.module';
import { LandingModule } from './landing/landing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    AxaSiteModule,
    LandingModule,
    CommonModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: navigator.language
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
