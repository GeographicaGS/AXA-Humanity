import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AxaSiteComponent } from './axa-site.component';

const routes: Routes = [
  {
    path: 'map',
    component: AxaSiteComponent,
  },
  { path: '**', redirectTo: '/not_found' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AxaSiteRoutingModule { }
