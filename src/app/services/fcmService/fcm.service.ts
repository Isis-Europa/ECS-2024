import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DeliveredNotifications, PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { GeolocationService } from '../geolocationService/geolocation.service';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

// Service Notifiche
export class FcmService {

  mapPosition = {
    "latitude": localStorage.getItem("latitude"),
    "longitude": localStorage.getItem("longitude"),
    "mapRadius": [localStorage.getItem("latitude"), localStorage.getItem("longitude")]
  }

  constructor(private http: HttpClient, public geolocation: GeolocationService, public platform: Platform, public router: Router) {
    // Attiva i listeners quando viene chiamato il service
    this.addListeners()

    console.log(this.mapPosition)
  }
  
  async addListeners() {

    // Registra token per le notifiche
    await PushNotifications.addListener('registration', token => {
      alert('Registration token: '+ token.value);
      console.log('Registration token: ' + token.value);

      // Salva il token nel localstorage
      localStorage.setItem("senderId", token.value);

      let topic: string;
      // Se la piattaforma dove è situata l'app è android setta il topic google
      if (Capacitor.getPlatform() === "android") {
        topic = 'google'
      } else {
        // Altrimenti setta not-registered
        topic = "not-registered"
      }

      // Setta il topic
      FCM.subscribeTo({ topic })
        .then(res => {
          console.log(`Utente registrato al topic: ${topic}`)
          alert(`Utente registrato al topic: ${topic}`)
        })
        .catch(err => {
          console.log(`C'è stato un errore nell'iscrizione al topic: ${topic}`)
          alert(`C'è stato un errore nell'iscrizione al topic: ${topic}`)
        })
    });

    // Listener per gli errori nella registrazione del token
    await PushNotifications.addListener('registrationError', err => {
      alert('Registration error: '+ err.error);
    });

    // Listener per quando arriva una notifica
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      if (notification.data.senderId == localStorage.getItem("senderId")) {
        
      }
      alert("Nuova notifica")
    });

    // Listener che controlla quando la notifica che è arrivata viene cliccata
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      // Controllo se la notifica rientra nel range di km e se la richiesta è stata mandata dallo stesso telefono
      if (this.geolocation.getDistanceFromLatLonInKm(Number(localStorage.getItem("latitude")), Number(localStorage.getItem("longitude")), Number(notification.notification.data.latitude), Number(notification.notification.data.latitude)) >= 1 && notification.notification.data.senderId != localStorage.getItem("senderId")) {
        alert("Sei vicino all'emergenza")

        this.mapPosition = {
          "latitude": notification.notification.data.latitude,
          "longitude": notification.notification.data.longitude,
          "mapRadius": [String(((notification.notification.data.latitude * 0.01620335656627)/100)), String(((notification.notification.data.longitude *0.08902387934646)/100))]
        }

        this.router.navigate(["/map-sos"])

        // Per la mappa
        // document.getElementById('iframe_map')?.setAttribute("src", "https://www.openstreetmap.org/export/embed.html?bbox="+ this.longitude +"," + this.latitude +"," + this.longitude +","+ this.latitude +";layer=mapnik;marker="+ this.latitude +","+ this.longitude +"")

        // localStorage.setItem("lastNotificationPerformedLatitude", notification.notification.data.latitude)
        // localStorage.setItem("lastNotificationPerformedLongitude", notification.notification.data.longitude)
      }
      alert('Push notification performed data: '+ JSON.stringify(notification.notification.data));
    });
  }

  // Funzione per controllare se si hanno i permessi per le notifiche e registrazione del token
  async registerPushNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    alert(JSON.stringify(permStatus))

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    if (permStatus.receive === "granted") {
      try {
        await PushNotifications.register();
      } catch (error) {
        alert(JSON.stringify(error))
      }
    }

  }

  // Funzione per annullare il token registrato precedentemente
  async unregisterPushNotification() {
    await PushNotifications.unregister().then((token) => alert("Unregistered Token: "+token))
  }

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    alert('delivered notifications '+ JSON.stringify(notificationList));
  }

  // async removeDeliveredNotifications(delivered: DeliveredNotifications): Promise<void> {
  //   // Implement the logic to remove the specified notifications
  //   // For example, you might remove the notification from the displayed list
  // }

  // Funzione per inviare una notifica
  async sendNotification() {

    // Header per l'access token
    let headers_token: HttpHeaders = new HttpHeaders(
      { 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET' 
    })

    // Richiesta per l'access token su un nostro hosting attraverso php
    await this.http.get("https://sitomattiachat.altervista.org/ecs/", { headers: headers_token }).subscribe(
      (data: any) => {

        // Headers per l'invio della notifica
        let headers_firebase: HttpHeaders = new HttpHeaders(
          {
          'Content-Type': 'application\json', 
          'Authorization': 'Bearer ' + data
        })


        // Contenuto e tipo della notifica
        let json = {
          "message": {
            "topic": "google",
            "android": {
              "notification": {
                "title": "SOS - Geolocation",
                "body": "Qualcuno ha richiesto il tuo intervento clicca e visualizza la sua posizione!"
              },
              "data": {
                "latitude": localStorage.getItem("latitude"),
                "longitude": localStorage.getItem("longitude")
              }
            }
          }
        }

        // let json = {
        //   "message": {
        //     "topic": "google",
        //     "data": {
        //       "latitude": localStorage.getItem("latitude"),
        //       "longitude": localStorage.getItem("longitude"),
        //       "senderId": localStorage.getItem("senderId")
        //     }
        //   }
        // }

        // Richiesta a Firebase Cloud Messaging di invio della notifica
        this.http.post("https://fcm.googleapis.com/v1/projects/stable-device-335608/messages:send", json, { headers: headers_firebase }).subscribe({
          next: (data) => {
            console.log(JSON.stringify(data))
          },
          error: (err: any) => {
            console.log(err)
          },
          complete: () => { console.log("Richiesta Completata") }
        });
      });

  }

  // Notifica in locale
  async sendLocalNotification() {

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "SOS - Geolocation",
          body: "Qualcuno ha richiesto il tuo aiuto nelle vicinanze"
        }
      ]
    })

  }
}