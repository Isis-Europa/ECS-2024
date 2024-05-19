import { Component, OnInit } from '@angular/core';
import { FcmService } from 'src/app/services/fcmService/fcm.service';
import { GeolocationService } from 'src/app/services/geolocationService/geolocation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public fcm: FcmService, public geolocation: GeolocationService) { }

  ngOnInit() {
  }

}
