import { Component, OnInit } from '@angular/core';
import { FcmService } from '../services/fcmService/fcm.service';
import { GeolocationService } from '../services/geolocationService/geolocation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public fcm: FcmService, public geolocation: GeolocationService) {}
  
}
