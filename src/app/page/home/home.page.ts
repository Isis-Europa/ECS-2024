import { Component, ElementRef, ViewChild } from '@angular/core';
import { FcmService } from '../../services/fcmService/fcm.service';
import { GeolocationService } from '../../services/geolocationService/geolocation.service';
import { GoogleMap } from "@capacitor/google-maps"
import { environment } from 'src/environments/environment';

// declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // @ViewChild("map") mapRef: ElementRef;
  // map: GoogleMap;

  // Variabili necessarie per il bottone SOS
  sosButtonDisabled: boolean = false;
  sosButtonTimeDeactivated: number = 10; // 5 minuti in secondi
  sosButtonTimeDeactivatedCountdown: number = this.sosButtonTimeDeactivated;
  minutes: number = Math.floor(this.sosButtonTimeDeactivated / 60);
  seconds: number = this.sosButtonTimeDeactivated % 60;
  public sosAlertPopup = [
    {
      text: 'Annulla',
      role: 'cancel',
      handler: () => {
        console.log('Richiesta SOS Annullata prima dell\'invio');
      },
    },
    {
      text: 'Invia',
      role: 'confirm',
      handler: () => {
        this.fcm.sendNotification();
        this.sosRequested();
        console.log('SOS Richiesto!');
      },
    },
  ];

  constructor(public fcm: FcmService, public geolocation: GeolocationService) {}

  // Funzione quando il bottone viene cliccato
  sosRequested(): void {
    // Disabilita Bottone
    this.sosButtonDisabled = true

    // Intervallo Countdown
    const interval = setInterval(() => {
      // Ogni secondo scala di 1 il Countdown
      this.sosButtonTimeDeactivatedCountdown--;
      // Aggiorna il tempo a schermo
      this.updateTime();

      // Se il Countdown e minore o uguale a 0, 
      if (this.sosButtonTimeDeactivatedCountdown <= 0) {
        // Finisci l'intervallo
        clearInterval(interval);
        // Riattiva il bottone
        this.sosButtonDisabled = false;
        console.log("Bottone SOS Riattivato");
      }
    }, 1000);

    // Resetta valori del Countdown
    this.sosButtonTimeDeactivatedCountdown = this.sosButtonTimeDeactivated;
    this.minutes = Math.floor(this.sosButtonTimeDeactivated / 60);
    this.seconds = this.sosButtonTimeDeactivated % 60;
  }

  // Funzione per aggiornare i dati che poi verranno mostrati a schermo
  updateTime(): void {
    this.minutes = Math.floor(this.sosButtonTimeDeactivatedCountdown / 60);
    this.seconds = this.sosButtonTimeDeactivatedCountdown % 60;
  }

  // ionViewDidEnter() {
  //   this.createMap()
  // }

  // async createMap() {
  //   this.map = await GoogleMap.create({
  //     id: '315f82868d2609b3', // Unique identifier for this map instance
  //     element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
  //     apiKey: environment.googleMapsApiKey, // Your Google Maps API Key
  //     config: {
  //       center: {
  //         // The initial position to be rendered by the map
  //         lat: JSON.parse(this.fcm.mapPosition.latitude || "{}"),
  //         lng: JSON.parse(this.fcm.mapPosition.longitude || "{}"),
  //       },
  //       zoom: 10, // The initial zoom level to be rendered by the map
  //     },
  //   })

  //   this.addMarker()
  //   console.log("marker asd")
  // }

  // async addMarker() {
  //   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")

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

}
