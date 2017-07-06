import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { UtilsService } from './utils.service';
import { CommonRoutingModule } from './common-routing.module';

@NgModule({
  imports: [
    NGCommonModule,
    CommonRoutingModule
  ],
  exports: [CommonRoutingModule],
  providers: [UtilsService],
  declarations: []
})
export class CommonModule { }
