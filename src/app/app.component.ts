import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/fcmService/fcm.service';
import { GeolocationService } from './services/geolocationService/geolocation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  currentUrl: string;
  
  constructor(public fcm: FcmService, public geolocation: GeolocationService, private location: Location) {}

  ngOnInit(): void {
    this.currentUrl = this.location.path()

    // Quando l'app viene caricata, avvia chiama i due service
    this.fcm;
    this.geolocation;
  }

  changeActivedTab(tabName: string) {
    let button = document.querySelectorAll("ion-tabs > ion-tab-bar > ion-tab-button > ion-icon")

    button.forEach(element => {
      if (element.id == tabName) {
        element.setAttribute("size", "normal")
        element.parentElement?.classList.add("active-tab")
        console.log("Active Tab: " + tabName)
      } else {
        element.setAttribute("size", "small")
        element.parentElement?.classList.remove("active-tab")
      }
    });

  }
  
}
