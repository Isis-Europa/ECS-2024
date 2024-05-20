import { Injectable, OnInit } from '@angular/core';
import { Geolocation, WatchPositionCallback } from "@capacitor/geolocation";
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { FcmService } from '../fcmService/fcm.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  latitude: string;
  longitude: string;

  constructor() { 
    // Quando il service viene chiamato controlla la posizione
    this.watchLocation()
  }

  // Funzione per il controllo della posizione
  async watchLocation() {
    const options: PositionOptions = {
      enableHighAccuracy: true
    };

    let callback: WatchPositionCallback = (position) => {
      console.log("Posizione aggiornata: " + position?.coords.latitude + " | " + position?.coords.longitude)
      this.getCurrentLocation()
    }

    await Geolocation.watchPosition(options, callback)
      .then((watchId: string) => {
        console.log("Controllando il cambio di posizione. Controllo n. " + watchId)
      })
      .catch((error) => {
        console.log("Errore durante il controllo della posizione: " + error)
        let prova = document.querySelector("h2")
        prova!.textContent = error
      })
  }

  // Controllo permessi posizione
  async checkPermissions() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log("Stato dei permessi: " + permissionStatus.location)

      if (permissionStatus.location != "granted") {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location != "granted") {
          // vai alle impostazioni della posizione
          await this.openSettings(true)
          return;
        } else {
          return "ok_Permissions";
        }
      } else {
        return "ok_Permissions";
      }
    } catch (e: any) {
      if (e?.message == "Location services are not enabled") {
        await this.openSettings()
      }
      console.log(e);
      let prova = document.querySelector("#coordinates-text")
      prova!.textContent = e
      return "error_Permissions"
    }
  }

  // Prende la posizione attuale
  async getCurrentLocation() {
    // Controllo permessi
    if (await this.checkPermissions() === "ok_Permissions") {
      let options: PositionOptions = {
        enableHighAccuracy: true
      };

      // Prendere la posizione
      const position = await Geolocation.getCurrentPosition(options);
      // Quando aggiorni la posizione, cambia anche il testo
      let prova = document.querySelector("#coordinates-text")
      prova!.textContent = "Latitudine: " + position.coords.latitude + "\n Longitudine: " + position.coords.longitude;
      
      // Salvare nel localsotrage le ultime coordinate
      localStorage.setItem("latitude", String(position.coords.latitude))
      localStorage.setItem("longitude", String(position.coords.longitude))
    } else {
      // Se i permessi mancano vai alle impostazioni
      this.openSettings();
    }
  }

  // Funzione per aprire le impostazioni del telefono
  openSettings(app = false) {
    console.log("aprendo le impostazioni...")
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }

  // Funzione per calcolare il range di km tra due coordinate
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in kilometers
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var km = R * c; // Distance in KM
    return km;
  }

  // Funzione aggiuntiva per il calcolo del range
  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

}
