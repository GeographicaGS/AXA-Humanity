import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { CommonRoutingModule } from './common-routing.module';

import { WindowService } from './window.service';

@NgModule({
  imports: [
    NGCommonModule,
    CommonRoutingModule
  ],
  exports: [CommonRoutingModule],
  providers: [WindowService],
  declarations: []
})
export class CommonModule { }
