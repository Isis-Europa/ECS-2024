import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/fcmService/fcm.service';
import { GeolocationService } from './services/geolocationService/geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public fcm: FcmService, public geolocation: GeolocationService) {}

  ngOnInit(): void {
    this.fcm;
    this.geolocation;
  }
}
