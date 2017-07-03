import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { CommonRoutingModule } from './common-routing.module';

@NgModule({
  imports: [
    NGCommonModule,
    CommonRoutingModule
  ],
  exports: [CommonRoutingModule],
  providers: [],
  declarations: []
})
export class CommonModule { }
