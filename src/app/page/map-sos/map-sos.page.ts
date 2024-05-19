import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Platform } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcmService/fcm.service';
import { environment } from 'src/environments/environment';
import { StartNavigation } from "@proteansoftware/capacitor-start-navigation";

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

  openMapApplication(): void {
    StartNavigation.launchMapsApp({
      latitude: this.fcm.mapPosition.latitude,
      longitude: this.fcm.mapPosition.longitude,
      name: "Posizione Emergenza",
      travelMode: "driving"
    })
  }

}
