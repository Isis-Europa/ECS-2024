import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapSosPage } from './map-sos.page';

const routes: Routes = [
  {
    path: '',
    component: MapSosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapSosPageRoutingModule {}
