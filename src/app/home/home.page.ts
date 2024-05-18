import { Component, OnInit } from '@angular/core';
import { FcmService } from '../services/fcmService/fcm.service';
import { GeolocationService } from '../services/geolocationService/geolocation.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public fcm: FcmService, public geolocation: GeolocationService, public sanitizer: DomSanitizer) {}
  
}
