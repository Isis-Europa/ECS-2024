import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { FcmService } from 'src/app/services/fcmService/fcm.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-sos',
  templateUrl: './map-sos.page.html',
  styleUrls: ['./map-sos.page.scss'],
})
export class MapSosPage {

  // @ViewChild("map") mapRef: ElementRef;
  // map: GoogleMap;

  constructor(public fcm: FcmService) { }

  // ionViewDidEnter() {
  //   this.createMap()
  // }

  // async createMap() {
  //   this.map = await GoogleMap.create({
  //     id: 'map-id', // Unique identifier for this map instance
  //     element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
  //     apiKey: environment.googleMapsApiKey, // Your Google Maps API Key
  //     config: {
  //       center: {
  //         // The initial position to be rendered by the map
  //         lat: JSON.parse(this.fcm.mapPosition.latitude || "{}"),
  //         lng: JSON.parse(this.fcm.mapPosition.longitude || "{}"),
  //       },
  //       zoom: 13, // The initial zoom level to be rendered by the map
  //     },
  //   })

  //   // this.addMarker()
  //   // console.log("marker asd")
  // }

  // async addMarker() {
  //   const { AdvancedMarkerElement } = await google.maps.Marker

  //   const markers = new AdvancedMarkerElement({
  //     map: this.map,
  //     position: {
  //       lat: JSON.parse(this.fcm.mapPosition.latitude || "{}"),
  //       lng: JSON.parse(this.fcm.mapPosition.longitude || "{}")
  //     },
  //     title: "Prova"
  //   })

  //   await this.map.addMarkers(markers)
  //   console.log("marker")
  // }

  // Funzione per aprire un'app di navigaione per raggiungere l'emergenza segnalata
  openMapApplication(): void {

    window.open("geo:0,0?q=" + this.fcm.mapPosition.latitude + "," + this.fcm.mapPosition.longitude +"", "_system");

    console.log("aprendo google maps")
  }

}
