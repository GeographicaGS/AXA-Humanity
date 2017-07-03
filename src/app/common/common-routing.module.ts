import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../../environments/environment';

const routes: Routes = [
  // {
  //   path: 'home',
  //   component: undefined, // @TODO: @alasar include here your LandingComponent
  // },
  // {
  //   path: 'not_found',
  //   component: undefined, // @TODO: include here a NotFoundComponent
  // },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
];

const config = <any>environment;

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: config.useHash ? config.useHash : false }) ],
  exports: [ RouterModule ]
})
export class CommonRoutingModule {}
