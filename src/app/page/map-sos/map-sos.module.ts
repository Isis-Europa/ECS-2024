import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapSosPageRoutingModule } from './map-sos-routing.module';

import { MapSosPage } from './map-sos.page';
import { SafePipe } from './map-sos.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapSosPageRoutingModule
  ],
  declarations: [MapSosPage, SafePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapSosPageModule {}
